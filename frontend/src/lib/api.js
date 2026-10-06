/**
 * Central API configuration for all n8n webhook endpoints.
 * NEVER hardcode any n8n URL anywhere else — always import from this file.
 */
import { apiCall, API_URL } from '../config/api';

// ─── n8n Base URL ────────────────────────────────────────────
export const N8N_BASE =
  process.env.REACT_APP_N8N_BASE || 'https://jobninjas.app.n8n.cloud/webhook';

// ─── Endpoint Map ────────────────────────────────────────────
export const ENDPOINTS = {
  // Resume Processing
  RESUME_PARSE:    `${N8N_BASE}/jobninjas/resume/parse`,
  RESUME_ANALYSE:  `${N8N_BASE}/jobninjas/resume/analyse`,
  RESUME_GENERATE: `${N8N_BASE}/jobninjas/resume/generate`,

  // AI Ninja setup
  NINJA_SKILLS:    `${N8N_BASE}/jobninjas/ninja/skills`,
  NINJA_ACTIVATE:  `${N8N_BASE}/jobninjas/ninja/activate`,

  // AI Ninja active state
  NINJA_DASHBOARD: `${N8N_BASE}/ai-ninja/dashboard`,
  LEADERBOARD:     `${N8N_BASE}/ai-ninja/leaderboard`,

  // Twilio transcription relay
  TRANSCRIPTION:   `${N8N_BASE}/ai-ninja/transcription`,

  // Onboarding
  ONBOARD:         `${N8N_BASE}/ai-ninja/onboard`,

  // Profile Optimization
  PROFILE_OPTIMIZE: `${N8N_BASE}/jobninjas/profile/optimize`,
};

// ─── Private Helpers ─────────────────────────────────────────

/**
 * Fetch with an AbortController timeout.
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} timeoutMs
 * @returns {Promise<any>}
 */
const fetchWithTimeout = async (url, options = {}, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`n8n error ${res.status}: ${errorText}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out — please try again.');
    }
    throw err;
  }
};

// ─── RESUME PROCESSING ───────────────────────────────────────────────

/**
 * Upload a PDF/DOCX file for resume parsing.
 * @param {File} file
 * @returns {Promise<{text: string, wordCount: number, detectedRole: string}>}
 */
export async function parseResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  // Using apiCall for local backend integration (Note: Form data needs headers cleared for fetch to set boundary)
  return apiCall('/api/scan/parse', {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': undefined } // Let browser set boundary
  });
}

/**
 * Parse pasted resume text.
 * @param {string} text
 * @returns {Promise<{text: string, wordCount: number, detectedRole: string}>}
 */
export async function parseResumeText(text) {
  return apiCall('/api/scan/parse', {
    method: 'POST',
    body: JSON.stringify({ resumeText: text }),
  });
}

/**
 * Analyse the job market for a target role against a resume.
 * @param {string} resumeText
 * @param {string} targetRole
 * @param {string[]} [targetCompanies]
 * @returns {Promise<{topSkills: string[], keyPhrases: string[], missingFromResume: string[], roleKeywords: string[], demandScore: number}>}
 */
export async function analyseResumeMarket(resumeText, targetRole, targetCompanies = []) {
  return apiCall('/api/resume/analyse', {
    method: 'POST',
    body: JSON.stringify({ 
      resumeText, 
      targetRole, 
      companies: targetCompanies 
    }),
  });
}

export async function generateResume({ 
  resumeText, 
  targetRole, 
  marketAnalysis = {}, 
  githubUrl, 
  linkedinUrl, 
  portfolioUrl, 
  strategicFocus, 
  targetCompanies 
}) {
  return fetchWithTimeout(
    `${API_URL}/api/resume/generate-one-resume`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        resumeText, 
        targetRole, 
        marketAnalysis, 
        githubUrl, 
        linkedinUrl, 
        portfolioUrl, 
        strategicFocus,
        targetCompanies 
      }),
    },
    120000, // 120s — generation takes longer for 2-3 pages
  );
}

// ─── VAULT (AWS RDS) ───────────────────────────────────────────────

/**
 * Fetch all saved resumes for the authenticated user from AWS RDS.
 * @param {string} email
 * @returns {Promise<any[]>}
 */
export async function fetchSavedResumes(email) {
  return apiCall(`/api/resumes?email=${encodeURIComponent(email)}`, {
    method: 'GET'
  });
}

/**
 * Save a generated masterpiece to the AWS RDS vault.
 * @param {object} payload - {user_email, target_role, resume_html, skills}
 */
export async function saveResumeToVault(payload) {
  return apiCall('/api/resumes', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Delete a resume from the AWS RDS vault.
 */
export async function deleteResumeFromVault(resumeId, email) {
  return apiCall(`/api/resumes/${resumeId}?email=${encodeURIComponent(email)}`, {
    method: 'DELETE'
  });
}

// ─── AI NINJA SETUP ──────────────────────────────────────────

/**
 * Extract skills from resume text.
 * @param {string} resumeText
 * @returns {Promise<Array<{category: string, skills: string[]}>>}
 */
export async function extractSkills(resumeText) {
  return apiCall('/api/ninja/skills', {
    method: 'POST',
    body: JSON.stringify({ resume_text: resumeText }),
  });
}

/**
 * Activate the AI Ninja plan.
 * @param {object} payload
 * @returns {Promise<{success: boolean, planId: string, depthPhaseDays: number, gapPhaseDays: number, totalDays: number, firstCallDate: string, message: string}>}
 */
export async function activateNinja(payload) {
  return apiCall('/api/ninja/v2/activate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── ONBOARDING ──────────────────────────────────────────────

/**
 * Fetch existing onboarding survey progress.
 * @param {string} email
 */
export const fetchOnboardingSurvey = async (email) => {
  const data = await apiCall(`/ninja/onboard?email=${email}`);
  return data.survey;
};

/**
 * Onboard a new AI Ninja user.

 * @param {object} payload
 * @returns {Promise<{success: boolean, userId: string, message: string, depthPhaseDays: number, missingSkillsCount: number, dailyCallTime: string, note: string}>}
 */
export async function onboardUser(payload) {
  return apiCall('/api/ninja/onboard', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Optimize profile based on user work details.
 * @param {object} payload 
 */
export async function optimizeProfile(payload) {
  return fetchWithTimeout(ENDPOINTS.PROFILE_OPTIMIZE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ─── DASHBOARD + LEADERBOARD ─────────────────────────────────

/**
 * Fetch the AI Ninja dashboard for a user from AWS RDS.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function fetchDashboard(userId) {
  const v2Data = await apiCall(`/api/ninja/v2/dashboard?email=${encodeURIComponent(userId)}`);
  if (!v2Data || !v2Data.success) return v2Data;
  return {
    ...v2Data.profile,
    ...v2Data.stats,
    ...v2Data.user,
    email: v2Data.user?.email,
    targetRole: v2Data.profile?.target_role,
    subscription_tier: v2Data.profile?.plan,
    calls_remaining: v2Data.profile?.calls_remaining || 0,
    credits_balance: v2Data.profile?.credits_balance || 0,
    sessionsCompleted: v2Data.stats?.total_calls || 0,
  };
}

/**
 * Fetch the global leaderboard from AWS RDS.
 * @param {string} userId
 * @param {number} [limit=20]
 * @returns {Promise<object>}
 */
export async function fetchLeaderboard(userId, limit = 20) {
  return apiCall(`/api/ninja/v2/leaderboard?limit=${limit}`);
}

/**
 * Fetch the AI Ninja roadmap for a user from AWS RDS.
 * @param {string} userId
 * @returns {Promise<any[]>}
 */
export async function fetchNinjaRoadmap(userId) {
  const v2Data = await apiCall(`/api/ninja/v2/dashboard?email=${encodeURIComponent(userId)}`);
  
  if (!v2Data || !v2Data.roadmap) return { steps: [] };
  
  const roadmap = v2Data.roadmap;
  const sessions = roadmap.sessions || [];
  
  // Map sessions to the 'steps' format expected by the frontend components
  const steps = sessions.map((session, index) => ({
    id: index + 1,
    day_number: session.day || session.session_number || (index + 1),
    topic_category: "Tactical Session",
    difficulty: session.difficulty || "Advanced",
    estimated_minutes: session.estimated_minutes || 60,
    topic: session.topic,
    description: session.description,
    notes: session.focus_points ? session.focus_points.join(', ') : "Review session focus points.",
    is_call_day: session.is_call_day || false,
    youtube_links: roadmap.resources ? roadmap.resources.map(r => r.url) : [],
  }));

  return { steps };
}

// ─── BACKEND API (reports, profile, etc.) ────────────────────

/**
 * Legacy API object for backward compatibility with AINinjaContext.
 * New code should import the named functions above directly.
 */
export const aiNinjaApi = {
  onboard: (data) =>
    onboardUser(data),

  getDashboard: (userId) =>
    fetchDashboard(userId),

  getLeaderboard: (limit = 20) =>
    apiCall(`/api/ninja/v2/leaderboard?limit=${limit}`),

  getProfile: () =>
    apiCall('/api/ai-ninja/profile'),

  getCalls: (userId) => {
    const url = new URL(ENDPOINTS.TRANSCRIPTION);
    url.searchParams.set('userId', userId);
    return fetchWithTimeout(url.toString());
  },

  transcription: (data) =>
    fetchWithTimeout(ENDPOINTS.TRANSCRIPTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

// ─── REPORT ENDPOINTS (via backend API) ──────────────────────

export async function fetchDailyReports(userId) {
  return apiCall(`/api/ai-ninja/reports/daily?userId=${encodeURIComponent(userId)}`);
}

/**
 * Fetch weekly reports.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchWeeklyReports(userId) {
  return apiCall(`/api/ai-ninja/reports/weekly?userId=${encodeURIComponent(userId)}`);
}

/**
 * Fetch monthly reports.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchMonthlyReports(userId) {
  return apiCall(`/api/ai-ninja/reports/monthly?userId=${encodeURIComponent(userId)}`);
}

/**
 * Fetch recent interview sessions.
 * @param {string} userId
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchRecentInterviews(userId, limit = 5) {
  return apiCall(`/api/interviews/recent?userId=${encodeURIComponent(userId)}&limit=${limit}`);
}


/**
 * Fetch streak calendar data (last 90 days).
 * @param {string} userId
 * @returns {Promise<Array<{date: string, score: number}>>}
 */
export async function fetchStreakCalendar(userId) {
  return apiCall(`/api/ai-ninja/reports/streak?userId=${encodeURIComponent(userId)}`);
}

/**
 * Trigger an AI Ninja practice call.
 * @param {Object} payload { userId, email, targetRole, dayNumber }
 */
export async function startNinjaPractice(payload) {
  return apiCall(`/api/ninja/v2/call`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Reset AI Ninja progress and deactivate roadmap.
 * @param {string} userId 
 */
export async function resetNinjaProgress(userId) {
  return apiCall(`/api/ai-ninja/reset?userId=${encodeURIComponent(userId)}`, {
    method: 'POST'
  });
}

// ─── V2 NATIVE API (FastAPI direct — no n8n) ─────────────────

/**
 * V2 Onboard: Create/update user_profiles with prep modes, plan type, course URLs.
 * @param {object} payload { email, name, phone, current_role, target_role, plan_type, prep_modes, skill_confidences, course_urls, ... }
 */
export async function v2Onboard(payload) {
  return apiCall('/api/ninja/v2/onboard', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * V2 Dashboard: Get full dashboard data (profile, stats, recent results, roadmap, leaderboard rank).
 * @param {string} email
 */
export async function v2Dashboard(email) {
  return apiCall(`/api/ninja/v2/dashboard?email=${encodeURIComponent(email)}`);
}

/**
 * V2 Leaderboard: Get ranked leaderboard from the leaderboard table.
 * @param {number} [limit=20]
 */
export async function v2Leaderboard(limit = 20) {
  return apiCall(`/api/ninja/v2/leaderboard?limit=${limit}`);
}

/**
 * V2 Schedule Call: Create a call_schedule record for the user.
 * @param {object} payload { email, prep_mode, day_number }
 */
export async function v2ScheduleCall(payload) {
  return apiCall('/api/ninja/v2/call', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export default aiNinjaApi;

