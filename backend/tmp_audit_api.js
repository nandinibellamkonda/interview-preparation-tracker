const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base = 'http://localhost:5000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTIyYWEzMzUxMjczNGE3MDBhOWM0MjkiLCJpYXQiOjE3ODA3MjI1MjksImV4cCI6MTc4MDcyNjEyOX0.uPNnpGXRDNZmyh8_WJYSAYj5CC0saIh_yYYJ1-Usojk';
const headers = (t)=>({ 'Content-Type': 'application/json', ...(t?{Authorization:'Bearer '+t}:{}) });
(async ()=>{
  const results = {};
  try{
    // Auth: login
    try {
      let res = await fetch(base + '/api/auth/login', {method:'POST', headers:headers(), body: JSON.stringify({email:'nandini@test.com', password:'password'})});
      results.auth_login = { status: res.status, body: await res.text() };
    } catch (e) { results.auth_login = { error: e.message } }

    // Protected: dashboard
    try{
      let res = await fetch(base + '/api/dashboard', {headers: headers(token)});
      results.dashboard = { status: res.status, body: await res.text().then(t=>t.slice(0,1000)) };
    }catch(e){ results.dashboard = { error: e.message } }

    // Topics list
    try{ let r = await fetch(base + '/api/topics', {headers:headers(token)}); results.topics_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.topics_get={error:e.message}}
    // Goals list
    try{ let r = await fetch(base + '/api/goals', {headers:headers(token)}); results.goals_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.goals_get={error:e.message}}
    // Companies
    try{ let r = await fetch(base + '/api/companies', {headers:headers(token)}); results.companies_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.companies_get={error:e.message}}
    // Mock interviews
    try{ let r = await fetch(base + '/api/mock-interviews', {headers:headers(token)}); results.mock_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.mock_get={error:e.message}}
    // Resumes
    try{ let r = await fetch(base + '/api/resumes', {headers:headers(token)}); results.resumes_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.resumes_get={error:e.message}}
    // Notes
    try{ let r = await fetch(base + '/api/notes', {headers:headers(token)}); results.notes_get = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.notes_get={error:e.message}}
    // Analytics
    try{ let r = await fetch(base + '/api/analytics/topics', {headers:headers(token)}); results.analytics_topics = {status:r.status, body: await r.text().then(t=>t.slice(0,1000))}; }catch(e){results.analytics_topics={error:e.message}}
    // AI insights
    try{ let r = await fetch(base + '/api/ai', {headers:headers(token)}); results.ai = {status:r.status, body: await r.text().then(t=>t.slice(0,1500))}; }catch(e){results.ai={error:e.message}}

    console.log(JSON.stringify(results,null,2));
  }catch(e){console.error('fatal',e.message)}
})();
