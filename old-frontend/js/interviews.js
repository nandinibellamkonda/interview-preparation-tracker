const interviewList = document.getElementById('interviewList');
const logoutButton = document.getElementById('logoutButton');

const renderInterviews = (interviews) => {
  if (!interviewList) return;
  
  interviews.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
  
  interviewList.innerHTML = interviews.length ? interviews.map(interview => `
    <div class="timeline-step">
      <strong>${interview.company} • ${interview.round}</strong>
      <span>${interview.interviewType} · ${new Date(interview.interviewDate).toLocaleString()}</span>
      <small>Status: ${interview.result}</small>
    </div>
  `).join('') : '<p class="muted">No interviews scheduled. Focus on applications and interview prep!</p>';
};

const loadInterviews = async () => {
  const token = localStorage.getItem('pp_token');
  if (!token) return window.location.href = '/pages/login.html';

  try {
    const interviews = await fetchJson('/api/interviews');
    renderInterviews(interviews);
  } catch (err) {
    console.error(err);
    logout();
  }
};

if (logoutButton) logoutButton.addEventListener('click', logout);

loadInterviews();
