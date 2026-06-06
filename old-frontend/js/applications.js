const applicationsBoard = document.getElementById('applicationsBoard');
const applicationForm = document.getElementById('applicationForm');
const newApplicationToggle = document.getElementById('newApplicationToggle');
const logoutButton = document.getElementById('logoutButton');

const statuses = ['Applied', 'OA', 'Interview', 'HR', 'Selected', 'Rejected'];

const renderApplicationsKanban = (applications) => {
  if (!applicationsBoard) return;
  
  applicationsBoard.innerHTML = statuses.map(status => {
    const filtered = applications.filter(app => app.status === status);
    return `
      <div class="kanban-column">
        <div class="kanban-column-title">
          <span>${status}</span>
          <span class="muted">${filtered.length}</span>
        </div>
        ${filtered.map(app => `
          <div class="kanban-card">
            <h4>${app.companyName}</h4>
            <small>${app.role} • ${app.package || 'Pending'}</small>
            <small>${new Date(app.applicationDate).toLocaleDateString()}</small>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
};

const loadApplications = async () => {
  const token = localStorage.getItem('pp_token');
  if (!token) return window.location.href = '/pages/login.html';

  try {
    const applications = await fetchJson('/api/applications');
    renderApplicationsKanban(applications);
  } catch (err) {
    console.error(err);
    logout();
  }
};

const submitApplication = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('pp_token');
  if (!token) return logout();

  try {
    const payload = {
      companyName: document.getElementById('companyName').value,
      role: document.getElementById('roleName').value,
      package: document.getElementById('package').value,
      applicationDate: document.getElementById('applicationDate').value,
      status: document.getElementById('applicationStatus').value
    };

    const response = await fetchJson('/api/applications', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response) {
      applicationForm.reset();
      applicationForm.classList.add('hidden');
      loadApplications();
    }
  } catch (err) {
    alert(err.message);
  }
};

if (newApplicationToggle && applicationForm) {
  newApplicationToggle.addEventListener('click', () => {
    applicationForm.classList.toggle('hidden');
  });

  applicationForm.addEventListener('submit', submitApplication);
}

if (logoutButton) logoutButton.addEventListener('click', logout);

loadApplications();
