const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base = 'http://localhost:5000';
const h = ()=>({ 'Content-Type':'application/json' });

(async ()=>{
  const TEST_ID = `ci-${Date.now()}`;
  const testUser = { fullName: 'Audit User', email: `audit+ci+${TEST_ID}@example.com`, password: 'Password123!', college: 'Test University', branch: 'CS', role: 'Student', graduationYear: 2025 };
  const loginOrRegister = async () => {
    let res = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) });
    if (res.status === 200) return (await res.json()).token;
    let reg = await fetch(base + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testUser) });
    if (reg.status === 201) return (await reg.json()).token;
    let retry = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) });
    if (retry.status === 200) return (await retry.json()).token;
    throw new Error('Failed to obtain auth token');
  };

  const token = await loginOrRegister();
  const ah = ()=>({ 'Content-Type':'application/json', Authorization: 'Bearer '+token });
  const created = { companies: [] };
  try{
    const out = {};
    // Create company
    let create = await fetch(base + '/api/companies', { method:'POST', headers:ah(), body: JSON.stringify({ companyName:`TestCorp-${TEST_ID}`, role:'SDE', applicationDate: new Date().toISOString(), notes:'Test application' }) });
    out.create = { status: create.status, body: await create.text() };
    const createdCompany = create.status===201 ? JSON.parse(out.create.body) : null;
    if (createdCompany) created.companies.push(createdCompany._id);

    // Get company by id
    if (createdCompany) {
      let get = await fetch(base + '/api/companies/' + createdCompany._id, { headers: ah() });
      out.get = { status: get.status, body: await get.text() };

      // Update company (change role)
      let upd = await fetch(base + '/api/companies/' + createdCompany._id, { method:'PUT', headers:ah(), body: JSON.stringify({ role: 'Senior SDE' }) });
      out.update = { status: upd.status, body: await upd.text() };

      // Update rounds sequentially
      const rounds = ['oaStatus','technicalRound1Status','technicalRound2Status','hrRoundStatus'];
      out.rounds = {};
      for (const round of rounds) {
        let r = await fetch(base + '/api/companies/' + createdCompany._id + '/round-status', { method:'PUT', headers:ah(), body: JSON.stringify({ round, status: 'Cleared' }) });
        out.rounds[round+'_cleared'] = { status: r.status, body: await r.text() };
      }

      // Mark one as rejected for coverage
      let rej = await fetch(base + '/api/companies/' + createdCompany._id + '/round-status', { method:'PUT', headers:ah(), body: JSON.stringify({ round:'technicalRound1Status', status:'Rejected' }) });
      out.rounds['technicalRound1_rejected'] = { status: rej.status, body: await rej.text() };

      // Dashboard
      let dash = await fetch(base + '/api/dashboard', { headers: ah() });
      out.dashboard = { status: dash.status, body: await dash.text().then(t=>t.slice(0,2000)) };

      // Delete company
      let del = await fetch(base + '/api/companies/' + createdCompany._id, { method:'DELETE', headers:ah() });
      out.delete = { status: del.status, body: await del.text() };
    }

    console.log(JSON.stringify(out, null, 2));
  } catch(e){ console.error('fatal', e.message); }
  finally {
    const summary = { createdCounts: {}, deletedCounts: {} };
    try {
      summary.createdCounts = { companies: created.companies.length };
      for (const id of created.companies) {
        try { await fetch(base + '/api/companies/' + id, { method:'DELETE', headers: ah() }); summary.deletedCounts.companies = (summary.deletedCounts.companies || 0) + 1; } catch (e) {}
      }
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
      } catch (e) {}
    } catch (e) { console.error('cleanup failed', e.message); }
    console.log('CLEANUP SUMMARY', JSON.stringify(summary));
  }
})();
