const welcomeHeading = document.getElementById('welcomeHeading');
const welcomeSubtext = document.getElementById('welcomeSubtext');
const profileName = document.getElementById('profileName');
const profileCollege = document.getElementById('profileCollege');
const profileInitials = document.querySelector('.profile-chip span');
const dsaTrackerValue = document.getElementById('dsaTrackerValue');
const dsaTrackerMeta = document.getElementById('dsaTrackerMeta');
const sqlTrackerValue = document.getElementById('sqlTrackerValue');
const sqlTrackerMeta = document.getElementById('sqlTrackerMeta');
const javaTrackerValue = document.getElementById('javaTrackerValue');
const javaTrackerMeta = document.getElementById('javaTrackerMeta');
const readinessScoreValue = document.getElementById('readinessScoreValue');
const readinessScoreMeta = document.getElementById('readinessScoreMeta');
const applicationsSummary = document.getElementById('applicationsSummary');
const applicationsPanel = document.getElementById('applicationsPanel');
const interviewsSummary = document.getElementById('interviewsSummary');
const interviewSchedulePanel = document.getElementById('interviewSchedulePanel');
const resumeStatus = document.getElementById('resumeStatus');
const resumeChecklist = document.getElementById('resumeChecklist');
const logoutButton = document.getElementById('logoutButton');

const renderChecklist = (items) => {
  if (!resumeChecklist) return;
  if (!items || !items.length) {
    resumeChecklist.innerHTML = '<p class="muted">Resume checklist items will appear once you update your profile and document status.</p>';
    return;
  }
  resumeChecklist.innerHTML = items.map((item) => `
    <label class="resume-item"><input type="checkbox" ${item.completed ? 'checked' : ''} disabled /> ${item.label}</label>
  `).join('');
};

const updateCard = (element, value, meta) => {
  if (!element) return;
  element.textContent = value;
  if (meta) element.nextElementSibling.textContent = meta;
};

const loadDashboard = async () => {
  const token = localStorage.getItem('pp_token');
  if (!token) return window.location.href = '/pages/login.html';

  try {
    const profile = await fetchJson('/api/auth/profile');
    const user = profile.user || {};
    const summary = profile.summary || {};

    welcomeHeading.textContent = `Hello, ${user.fullName || 'Student'}`;
    welcomeSubtext.textContent = user.branch ? `${user.branch} • ${user.role || 'Target role'}` : 'Build your placement plan by tracking practice and applications.';
    profileName.textContent = user.fullName || 'Student';
    if (profileCollege) profileCollege.textContent = user.college || 'Profile details';
    if (profileInitials) profileInitials.textContent = user.fullName ? user.fullName.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase() : 'PP';

    const totalSolved = summary.totalSolved || 0;
    const trackedTopics = summary.topicsCount || 0;
    dsaTrackerValue.textContent = totalSolved ? `${totalSolved} solved` : 'No progress yet';
    dsaTrackerMeta.textContent = trackedTopics ? `${trackedTopics} tracked topic${trackedTopics > 1 ? 's' : ''}` : 'Start tracking your first DSA topic.';

    sqlTrackerValue.textContent = 'No progress yet';
    sqlTrackerMeta.textContent = 'Record your first SQL practice session.';
    javaTrackerValue.textContent = 'No progress yet';
    javaTrackerMeta.textContent = 'Log your first Java practice session.';

    readinessScoreValue.textContent = `${summary.readinessScore || 0}%`;
    readinessScoreMeta.textContent = summary.readinessScore ? 'Updated from your tracked activity.' : 'Complete an action to generate a score.';

    applicationsSummary.textContent = `${summary.applicationsCount || 0} active`;
    if (!summary.applicationsCount) {
      applicationsPanel.innerHTML = '<p class="muted">No company applications have been added yet. Use the Applications page to begin tracking target roles and progress.</p>';
    } else {
      applicationsPanel.innerHTML = `<p>${summary.applicationsCount} application${summary.applicationsCount > 1 ? 's' : ''} are being tracked.</p>`;
    }

    interviewsSummary.textContent = `${summary.interviewsCount || 0} scheduled`;
    if (!summary.interviewsCount) {
      interviewSchedulePanel.innerHTML = '<p class="muted">Interview schedule will appear once you add company rounds.</p>';
    } else {
      interviewSchedulePanel.innerHTML = '<p>Upcoming interview details are shown in the Interviews page.</p>';
    }

    const resumeItems = profile.resumeReadiness ? profile.resumeReadiness.checklist : [];
    resumeStatus.textContent = `${resumeItems.length ? resumeItems.filter((item) => item.completed).length : 0} of ${resumeItems.length || 4}`;
    renderChecklist(resumeItems);
  } catch (err) {
    console.error(err);
    logout();
  }
};

if (logoutButton) logoutButton.addEventListener('click', logout);
loadDashboard();
