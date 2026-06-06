const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base = 'http://localhost:5000';
(async ()=>{
  const testUser = { fullName: 'Audit User', email: 'audit+ci@example.com', password: 'Password123!', college: 'Test University', branch: 'CS', role: 'Student', graduationYear: 2025 };
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
  const h = ()=>({ 'Content-Type':'application/json', Authorization: 'Bearer '+token });

  const out = {};
  try{
    const dash = await fetch(base + '/api/dashboard', { headers: h() });
    out.dashboard = { status: dash.status, body: await dash.text().then(t=>t.slice(0,2000)) };

    const weekly = await fetch(base + '/api/dashboard/analytics/weekly', { headers: h() });
    out.weekly = { status: weekly.status, body: await weekly.text() };

    const monthly = await fetch(base + '/api/dashboard/analytics/monthly', { headers: h() });
    out.monthly = { status: monthly.status, body: await monthly.text() };

    const topics = await fetch(base + '/api/dashboard/analytics/topics', { headers: h() });
    out.topics = { status: topics.status, body: await topics.text() };

    const radar = await fetch(base + '/api/dashboard/analytics/readiness-radar', { headers: h() });
    out.radar = { status: radar.status, body: await radar.text() };

    // AI endpoints
    const ai = await fetch(base + '/api/ai', { headers: h() });
    out.ai = { status: ai.status, body: await ai.text().then(t=>t.slice(0,2000)) };

    const ai_readiness = await fetch(base + '/api/ai/readiness', { headers: h() });
    out.ai_readiness = { status: ai_readiness.status, body: await ai_readiness.text() };

    const ai_plan = await fetch(base + '/api/ai/study-plan', { headers: h() });
    out.ai_plan = { status: ai_plan.status, body: await ai_plan.text().then(t=>t.slice(0,2000)) };

    console.log(JSON.stringify(out, null, 2));
  }catch(e){ console.error('fatal', e.message); }
})();
