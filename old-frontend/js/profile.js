const profileForm = document.getElementById('profileForm');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCollege = document.getElementById('profileCollege');
const profileGradYear = document.getElementById('profileGradYear');
const profileJoined = document.getElementById('profileJoined');
const profileMessage = document.getElementById('profileMessage');
const logoutButton = document.getElementById('logoutButton');

const loadProfile = async () => {
  const token = localStorage.getItem('pp_token');
  if (!token) return window.location.href = '/pages/login.html';

  try {
    const profile = await fetchJson('/api/auth/profile');
    const user = profile.user || {};

    profileName.value = user.fullName || '';
    profileEmail.value = user.email || '';
    profileCollege.value = user.college || '';
    profileGradYear.value = user.graduationYear || '';
    profileJoined.textContent = `Joined ${user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'recently'}`;
  } catch (err) {
    console.error(err);
    logout();
  }
};

const submitProfile = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('pp_token');
  if (!token) return logout();

  try {
    const payload = {
      fullName: profileName.value,
      college: profileCollege.value,
      graduationYear: Number(profileGradYear.value)
    };

    const response = await fetchJson('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (response) {
      profileMessage.textContent = 'Profile updated successfully!';
      setTimeout(() => {
        profileMessage.textContent = '';
      }, 3000);
    }
  } catch (err) {
    profileMessage.textContent = err.message;
  }
};

if (profileForm) profileForm.addEventListener('submit', submitProfile);
if (logoutButton) logoutButton.addEventListener('click', logout);

loadProfile();
