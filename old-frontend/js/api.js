const getAuthHeaders = () => {
  const token = localStorage.getItem('pp_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
    ...options
  });
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Unexpected error');
  }
  return response.json();
};

const redirectToLogin = () => {
  window.location.href = '/pages/login.html';
};

const logout = () => {
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_user');
  localStorage.removeItem('pp_isNewUser');
  localStorage.removeItem('pp_welcomeMessage');
  redirectToLogin();
};
