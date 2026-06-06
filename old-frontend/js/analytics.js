const logoutButton2 = document.getElementById('logoutButton');
if (logoutButton2) logoutButton2.addEventListener('click', () => { localStorage.removeItem('pp_token'); localStorage.removeItem('pp_user'); window.location.href = '/pages/login.html'; });
