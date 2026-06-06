const apiBase = '/api/auth';
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const redirectToDashboard = () => {
  window.location.href = '/pages/dashboard.html';
};

const validateSession = () => {
  const token = localStorage.getItem('pp_token');
  if (token) redirectToDashboard();
};

if (loginForm || registerForm) {
  validateSession();
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Login failed.');
      localStorage.setItem('pp_token', payload.token);
      localStorage.setItem('pp_user', JSON.stringify(payload.user));
      localStorage.removeItem('pp_isNewUser');
      redirectToDashboard();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fullName = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const college = document.getElementById('regCollege').value.trim();
    const branch = document.getElementById('regBranch').value;
    const role = document.getElementById('regRole').value;
    const graduationYear = Number(document.getElementById('regGradYear').value);

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, college, branch, role, graduationYear })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Registration failed.');
      localStorage.setItem('pp_token', payload.token);
      localStorage.setItem('pp_user', JSON.stringify(payload.user));
      if (payload.isNewUser) localStorage.setItem('pp_isNewUser', 'true');
      if (payload.welcomeMessage) localStorage.setItem('pp_welcomeMessage', payload.welcomeMessage);
      redirectToDashboard();
    } catch (error) {
      alert(error.message);
    }
  });
}
