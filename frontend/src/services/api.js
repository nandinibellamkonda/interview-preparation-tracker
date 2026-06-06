const normalizeApiUrl = (url) => url.replace(/\/+$/, '');
const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || '/api');
const buildApiUrl = (path) => `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
};

const getHeaders = (token = getStoredToken()) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

const parseJsonResponse = async (response, fallback = {}) => {
  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    let errorMessage = (data && (data.error || data.message)) || response.statusText || 'Request failed';
    if (response.status === 404) {
      errorMessage = 'Route not found. Verify the API path is correct.';
    } else if (response.status === 401 || response.status === 403) {
      errorMessage = (data && (data.error || data.message)) || 'Authentication failed. Check your credentials or token.';
    }
    throw new Error(errorMessage);
  }

  return data || fallback;
};

const fetchJson = async (url, options = {}, fallback = {}) => {
  // Ensure bodies are JSON strings and headers include Content-Type
  options = { ...(options || {}) };
  options.headers = { ...(options.headers || {}) };
  if (options.body && typeof options.body !== 'string') {
    // Do not stringify FormData, URLSearchParams, or Blobs (file uploads)
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const isURLSearchParams = typeof URLSearchParams !== 'undefined' && options.body instanceof URLSearchParams;
    const isBlob = typeof Blob !== 'undefined' && options.body instanceof Blob;
    if (!isFormData && !isURLSearchParams && !isBlob) {
      options.body = JSON.stringify(options.body);
      if (!options.headers['Content-Type'] && !options.headers['content-type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error('Network error: Unable to reach the backend. Is the server running?');
  }

  return parseJsonResponse(response, fallback);
};

// Auth Services
export const authService = {
  login: async (email, password) => {
    return fetchJson(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers: getHeaders(),
      body: { email, password },
    });
  },

  register: async (data) => {
    return fetchJson(buildApiUrl('/auth/register'), {
      method: 'POST',
      headers: getHeaders(),
      body: {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        college: data.college,
        branch: data.branch,
        role: data.role,
        graduationYear: data.graduationYear,
      },
    });
  },

  getProfile: async (token) => {
    return fetchJson(buildApiUrl('/auth/profile'), {
      headers: getHeaders(token),
    });
  },

  updateProfile: async (token, data) => {
    return fetchJson(buildApiUrl('/auth/profile'), {
      method: 'PATCH',
      headers: getHeaders(token),
      body: data,
    });
  },
};

// Topic Services
export const topicService = {
  getTopics: async (token) => {
    const response = await fetch(`${API_URL}/topics`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },

  createTopic: async (token, data) => {
    const response = await fetch(`${API_URL}/topics`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  updateTopic: async (token, id, data) => {
    const response = await fetch(`${API_URL}/topics/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteTopic: async (token, id) => {
    const response = await fetch(`${API_URL}/topics/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Goal Services
export const goalService = {
  getGoals: async (token) => {
    const response = await fetch(`${API_URL}/goals`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },

  createGoal: async (token, data) => {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  updateGoal: async (token, id, data) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteGoal: async (token, id) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Application Services
export const applicationService = {
  getApplications: async (token) => {
    const response = await fetch(`${API_URL}/applications`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },

  createApplication: async (token, data) => {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  updateApplication: async (token, id, data) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteApplication: async (token, id) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// DSA Services
export const dsaService = {
  createQuestion: async (token, data) => {
    const response = await fetch(`${API_URL}/dsa`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getQuestions: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/dsa?${queryString}`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  updateQuestion: async (token, id, data) => {
    const response = await fetch(`${API_URL}/dsa/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteQuestion: async (token, id) => {
    const response = await fetch(`${API_URL}/dsa/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getAnalytics: async (token) => {
    const response = await fetch(`${API_URL}/dsa/analytics`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Dashboard Services
export const dashboardService = {
  getDashboard: async (token) => {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getWeeklyAnalytics: async (token) => {
    const response = await fetch(`${API_URL}/dashboard/analytics/weekly`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getMonthlyAnalytics: async (token) => {
    const response = await fetch(`${API_URL}/dashboard/analytics/monthly`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getTopicDistribution: async (token) => {
    const response = await fetch(`${API_URL}/dashboard/analytics/topics`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getReadinessRadar: async (token) => {
    const response = await fetch(`${API_URL}/dashboard/analytics/readiness-radar`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

export const analyticsService = {
  getOverview: async (token) => {
    const response = await fetch(`${API_URL}/analytics`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
  getProblemsPerWeek: async (token) => {
    const response = await fetch(`${API_URL}/analytics/problems-per-week`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },
  getTopicProgress: async (token) => {
    const response = await fetch(`${API_URL}/analytics/topics`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },
  getInterviewSuccess: async (token) => {
    const response = await fetch(`${API_URL}/analytics/interview-success`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, {});
  },
  getConsistencyStreak: async (token) => {
    const response = await fetch(`${API_URL}/analytics/consistency-streak`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, {});
  },
};

export const aiService = {
  getInsights: async (token) => {
    const response = await fetch(`${API_URL}/ai`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Java Services
export const javaService = {
  createOrUpdateTopic: async (token, data) => {
    const response = await fetch(`${API_URL}/java`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getTopics: async (token) => {
    const response = await fetch(`${API_URL}/java`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getProgressSummary: async (token) => {
    const response = await fetch(`${API_URL}/java/summary`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  updateTopic: async (token, id, data) => {
    const response = await fetch(`${API_URL}/java/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteTopic: async (token, id) => {
    const response = await fetch(`${API_URL}/java/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// SQL Services
export const sqlService = {
  createOrUpdateTopic: async (token, data) => {
    const response = await fetch(`${API_URL}/sql`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getTopics: async (token) => {
    const response = await fetch(`${API_URL}/sql`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getProgressSummary: async (token) => {
    const response = await fetch(`${API_URL}/sql/summary`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  updateTopic: async (token, id, data) => {
    const response = await fetch(`${API_URL}/sql/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteTopic: async (token, id) => {
    const response = await fetch(`${API_URL}/sql/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Aptitude Services removed (out of scope)

// Revision Services removed (out of scope)

// Mock Interview Services
export const interviewService = {
  createInterview: async (token, data) => {
    const response = await fetch(`${API_URL}/interviews`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getInterviews: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/interviews${queryString ? `?${queryString}` : ''}`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },

  updateInterview: async (token, id, data) => {
    const response = await fetch(`${API_URL}/interviews/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteInterview: async (token, id) => {
    const response = await fetch(`${API_URL}/interviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

};

export const mockInterviewService = {
  createMockInterview: async (data) => {
    const response = await fetch(`${API_URL}/mock-interviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getMockInterviews: async () => {
    const response = await fetch(`${API_URL}/mock-interviews`, {
      headers: getHeaders(),
    });
    return parseJsonResponse(response, []);
  },

  getMockInterview: async (id) => {
    const response = await fetch(`${API_URL}/mock-interviews/${id}`, {
      headers: getHeaders(),
    });
    return parseJsonResponse(response);
  },

  updateMockInterview: async (id, data) => {
    const response = await fetch(`${API_URL}/mock-interviews/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteMockInterview: async (id) => {
    const response = await fetch(`${API_URL}/mock-interviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return parseJsonResponse(response);
  },
};

// Placement Services removed (out of scope)

// Leaderboard Services removed (out of scope)

// Achievement Services removed (out of scope)

// Notes Services
export const noteService = {
  createNote: async (token, data) => {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getNotes: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/notes${queryString ? `?${queryString}` : ''}`, {
      headers: getHeaders(token),
    });
    const data = await parseJsonResponse(response, { notes: [] });
    return data.notes || [];
  },

  getNoteById: async (token, id) => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      headers: getHeaders(token),
    });
    const data = await parseJsonResponse(response);
    return data.note;
  },

  updateNote: async (token, id, data) => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteNote: async (token, id) => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  pinNote: async (token, id) => {
    const response = await fetch(`${API_URL}/notes/${id}/pin`, {
      method: 'PUT',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },
};

// Daily Challenge Services removed (out of scope)

// Company Services
export const companyService = {
  getOrCreatePrep: async (token, company) => {
    const response = await fetch(`${API_URL}/company/${company}`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getAllPreps: async (token) => {
    const response = await fetch(`${API_URL}/company`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  updateChecklistItem: async (token, id, data) => {
    const response = await fetch(`${API_URL}/company/${id}/checklist`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },
};

// Company Tracker Services
export const companyTrackerService = {
  getCompanies: async () => {
    const response = await fetch(`${API_URL}/companies`, {
      headers: getHeaders(),
    });
    return parseJsonResponse(response, []);
  },

  getCompany: async (id) => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      headers: getHeaders(),
    });
    return parseJsonResponse(response);
  },

  createCompany: async (data) => {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  updateCompany: async (id, data) => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  deleteCompany: async (id) => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return parseJsonResponse(response);
  },

  updateRoundStatus: async (id, data) => {
    const response = await fetch(`${API_URL}/companies/${id}/round-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },
};

// Resume Services
export const resumeService = {
  getResumes: async (token) => {
    const response = await fetch(`${API_URL}/resumes`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response, []);
  },

  uploadResume: async (token, file, metadata = {}) => {
    const form = new FormData();
    form.append('resume', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });
    const response = await fetch(`${API_URL}/resumes`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
    return parseJsonResponse(response);
  },

  deleteResume: async (token, id) => {
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getResume: async (token, id) => {
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  updateResume: async (token, id, data) => {
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },
};

// Experience Services
export const experienceService = {
  createExperience: async (token, data) => {
    const response = await fetch(`${API_URL}/experiences`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getExperiences: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/experiences?${queryString}`);
    return parseJsonResponse(response);
  },

  getUserExperiences: async (token) => {
    const response = await fetch(`${API_URL}/experiences/user`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  upvoteExperience: async (token, id) => {
    const response = await fetch(`${API_URL}/experiences/${id}/upvote`, {
      method: 'PUT',
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getCompanies: async () => {
    const response = await fetch(`${API_URL}/experiences/companies`);
    return parseJsonResponse(response);
  },
};

// Study Plan Services
export const studyPlanService = {
  generatePlan: async (token, data) => {
    const response = await fetch(`${API_URL}/study-plans`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },

  getActivePlan: async (token) => {
    const response = await fetch(`${API_URL}/study-plans/active`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getStudyPlan: async (token) => {
    const response = await fetch(`${API_URL}/study-plans/active`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  getAllPlans: async (token) => {
    const response = await fetch(`${API_URL}/study-plans`, {
      headers: getHeaders(token),
    });
    return parseJsonResponse(response);
  },

  completeWeek: async (token, planId, data) => {
    const response = await fetch(`${API_URL}/study-plans/${planId}/complete-week`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return parseJsonResponse(response);
  },
};

// Flashcard Services removed (out of scope)

