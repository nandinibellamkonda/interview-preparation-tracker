const topicGrid = document.getElementById('topicGrid');
const logoutButton = document.getElementById('logoutButton');

const renderTopics = (topics) => {
  if (!topicGrid) return;
  topicGrid.innerHTML = topics.map((topic) => `
    <article class="topic-panel">
      <div class="topic-head">
        <h3>${topic.topicName}</h3>
        <span class="tag-pill ${topic.status === 'Mastered' ? 'done' : topic.status === 'In Progress' ? 'progress' : 'warning'}">${topic.status}</span>
      </div>
      <p>${topic.solvedQuestions}/${topic.totalQuestions} questions solved • ${topic.confidenceLevel} confidence</p>
      <div class="progress-bar"><div class="progress-fill" style="width: ${topic.progressPercent || Math.round((topic.solvedQuestions / Math.max(1, topic.totalQuestions)) * 100)}%;"></div></div>
    </article>
  `).join('');
};

const loadTracker = async () => {
  const token = localStorage.getItem('pp_token');
  if (!token) return window.location.href = '/pages/login.html';

  try {
    const response = await fetch('/api/topics', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Unable to load topics.');
    const topics = await response.json();
    renderTopics(topics);
  } catch (err) {
    console.error(err);
    localStorage.removeItem('pp_token');
    window.location.href = '/pages/login.html';
  }
};

if (logoutButton) logoutButton.addEventListener('click', () => {
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_user');
  window.location.href = '/pages/login.html';
});

loadTracker();
