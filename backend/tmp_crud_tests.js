const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base = 'http://localhost:5000';

(async ()=>{
  const TEST_ID = `ci-${Date.now()}`;
  const testUser = { fullName: 'Audit User', email: `audit+ci+${TEST_ID}@example.com`, password: 'Password123!', college: 'Test University', branch: 'CS', role: 'Student', graduationYear: 2025 };
  const loginOrRegister = async () => {
    // try login
    let res = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) });
    if (res.status === 200) return (await res.json()).token;
    // else try register
    let reg = await fetch(base + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testUser) });
    if (reg.status === 201) {
      const data = await reg.json();
      return data.token;
    }
    // if already exists or other error, attempt login again
    let retry = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) });
    if (retry.status === 200) return (await retry.json()).token;
    throw new Error('Failed to obtain auth token');
  };

  const token = await loginOrRegister();
  const h = ()=>({ 'Content-Type':'application/json', Authorization: 'Bearer '+token });
  const created = { topics: [], goals: [], companies: [], mocks: [], notes: [], resumes: [] };
  const out = {};
  try{
    // Topic create
    let res = await fetch(base + '/api/topics', { method:'POST', headers:h(), body: JSON.stringify({ topicName:`Audit Test Topic ${TEST_ID}`, category:'DSA', totalTopics:10, completedTopics:2, notes:`audit ${TEST_ID}` }) });
    out.topic_create = { status: res.status, body: await res.text() };
    const topic = res.status===201 ? JSON.parse(out.topic_create.body) : null;
    if (topic) created.topics.push(topic._id);

    // Topic update
    if (topic) {
      let r = await fetch(base + '/api/topics/' + topic._id, { method:'PUT', headers:h(), body: JSON.stringify({ completedTopics:5 }) });
      out.topic_update = { status: r.status, body: await r.text() };
    }

    // Goal create
    const targetDate = new Date(Date.now() + 7*24*3600*1000).toISOString();
    let g = await fetch(base + '/api/goals', { method:'POST', headers:h(), body: JSON.stringify({ title:`Audit Test Goal ${TEST_ID}`, description:'test', category:'DSA', targetDate, status:'Not Started', priority:'Medium' }) });
    out.goal_create = { status: g.status, body: await g.text() };
    const goal = g.status===201 ? JSON.parse(out.goal_create.body) : null;
    if (goal) created.goals.push(goal._id);

    // Goal complete update
    if (goal) {
      let gu = await fetch(base + '/api/goals/' + goal._id, { method:'PUT', headers:h(), body: JSON.stringify({ status:'Completed' }) });
      out.goal_update = { status: gu.status, body: await gu.text() };
    }

    // Company prep create/get
    let companyName = `TestCorp-${TEST_ID}`;
    let cp = await fetch(base + '/api/company/' + encodeURIComponent(companyName), { headers:h() });
    out.company_prep = { status: cp.status, body: await cp.text().then(t=>t.slice(0,1500)) };
    const cpObj = JSON.parse(out.company_prep.body).prep;
    if (cpObj) created.companies.push(cpObj._id);

    // Update checklist item
    if (cpObj) {
      const id = cpObj._id;
      let upd = await fetch(base + '/api/company/' + id + '/checklist', { method:'PUT', headers:h(), body: JSON.stringify({ itemIndex:0, completed:true }) });
      out.company_check_update = { status: upd.status, body: await upd.text().then(t=>t.slice(0,500)) };

      // Delete company prep
      let del = await fetch(base + '/api/company/' + id, { method:'DELETE', headers:h() });
      out.company_delete = { status: del.status, body: await del.text() };
    }

    // Mock interview create
    let mi = await fetch(base + '/api/mock-interviews', { method:'POST', headers:h(), body: JSON.stringify({ date: new Date().toISOString(), platform:'Zoom', score:75, feedback:`Good job ${TEST_ID}` }) });
    out.mock_create = { status: mi.status, body: await mi.text() };
    const mock = mi.status===201 ? JSON.parse(out.mock_create.body) : null;
    if (mock) {
      created.mocks.push(mock._id);
      let mu = await fetch(base + '/api/mock-interviews/' + mock._id, { method:'PUT', headers:h(), body: JSON.stringify({ date: mock.date, platform: mock.platform, score: 88, feedback:'Updated' }) });
      out.mock_update = { status: mu.status, body: await mu.text() };
      let md = await fetch(base + '/api/mock-interviews/' + mock._id, { method:'DELETE', headers:h() });
      out.mock_delete = { status: md.status, body: await md.text() };
    }

    // Note create
    let no = await fetch(base + '/api/notes', { method:'POST', headers:h(), body: JSON.stringify({ title:`Audit Note ${TEST_ID}`, content:'Audit note content', category:'General' }) });
    out.note_create = { status: no.status, body: await no.text() };
    const note = no.status===201 ? JSON.parse(out.note_create.body).note : null;
    if (note) {
      created.notes.push(note._id);
      let nu = await fetch(base + '/api/notes/' + note._id, { method:'PUT', headers:h(), body: JSON.stringify({ title:'Audit Note Updated' }) });
      out.note_update = { status: nu.status, body: await nu.text() };
      let nd = await fetch(base + '/api/notes/' + note._id, { method:'DELETE', headers:h() });
      out.note_delete = { status: nd.status, body: await nd.text() };
    }

    // Clean up topic and goal
    if (topic) {
      let td = await fetch(base + '/api/topics/' + topic._id, { method:'DELETE', headers:h() });
      out.topic_delete = { status: td.status, body: await td.text() };
    }
    if (goal) {
      let gd = await fetch(base + '/api/goals/' + goal._id, { method:'DELETE', headers:h() });
      out.goal_delete = { status: gd.status, body: await gd.text() };
    }

    // leave deletion to cleanup to ensure robust removal on failure too
    console.log(JSON.stringify(out, null, 2));
  }catch(e){ console.error('fatal', e.message); }
  finally {
    // Cleanup created resources and optionally delete test user via direct DB connection
    const summary = { createdCounts: {}, deletedCounts: {} };
    try {
      summary.createdCounts = Object.fromEntries(Object.keys(created).map(k => [k, created[k].length]));

      // delete topics
      for (const id of created.topics) {
        try { await fetch(base + '/api/topics/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.topics = (summary.deletedCounts.topics || 0) + 1; } catch (e) {}
      }
      // delete goals
      for (const id of created.goals) {
        try { await fetch(base + '/api/goals/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.goals = (summary.deletedCounts.goals || 0) + 1; } catch (e) {}
      }
      // delete company preps
      for (const id of created.companies) {
        try { await fetch(base + '/api/company/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.companies = (summary.deletedCounts.companies || 0) + 1; } catch (e) {}
      }
      // delete mock interviews
      for (const id of created.mocks) {
        try { await fetch(base + '/api/mock-interviews/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.mocks = (summary.deletedCounts.mocks || 0) + 1; } catch (e) {}
      }
      // delete notes
      for (const id of created.notes) {
        try { await fetch(base + '/api/notes/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.notes = (summary.deletedCounts.notes || 0) + 1; } catch (e) {}
      }
      // delete resumes if any
      for (const id of created.resumes) {
        try { await fetch(base + '/api/resumes/' + id, { method:'DELETE', headers:h() }); summary.deletedCounts.resumes = (summary.deletedCounts.resumes || 0) + 1; } catch (e) {}
      }

      // Attempt to delete test user by email via direct DB connection (safe because email includes TEST_ID)
      try {
        const mongoose = await import('mongoose');
        const dotenv = await import('dotenv');
        const path = await import('path');
        dotenv.config({ path: path.join(__dirname, '.env') });
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
        const User = (await import('./models/User.js')).default || (await import('./models/User.js'));
        const res = await User.deleteOne({ email: testUser.email.toLowerCase() });
        summary.deletedCounts.testUser = res.deletedCount || 0;
        await mongoose.disconnect();
      } catch (e) {
        // non-fatal
        summary.deletedCounts.testUser = summary.deletedCounts.testUser || 0;
      }
    } catch (e) {
      console.error('cleanup failed', e.message);
    }
    console.log('CLEANUP SUMMARY', JSON.stringify(summary));
  }
})();
