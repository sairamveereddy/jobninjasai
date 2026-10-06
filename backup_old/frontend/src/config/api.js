// API Configuration
// This file centralizes the API URL for the entire application

// Production API URL (Use relative path to leverage Vercel proxy at /api)
const PRODUCTION_API_URL = '';

// Development API URL (Use empty string to leverage local webpack proxy)
const DEVELOPMENT_API_URL = 'http://localhost:8000';

// Determine environment
const isProduction = window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

// Production API URL for Interview Service (Next.js)
const PRODUCTION_INTERVIEW_API_URL = ''; // Will use relative paths on same domain

// Use local backend for localhost, production for everything else
const getApiUrl = () => {
    // Force port 8000 on localhost to avoid stale env variable issues
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
        return DEVELOPMENT_API_URL || 'http://localhost:8000';
    }
    
    if (process.env.REACT_APP_API_URL !== undefined) {
        return process.env.REACT_APP_API_URL;
    }
    return isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
};

export const API_URL = getApiUrl();

// Interview API URL (Next.js saas-app)
export const INTERVIEW_API_URL = isProduction
  ? (PRODUCTION_INTERVIEW_API_URL || '')
  : 'http://localhost:3001';

// Helper function to make API calls with proper error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const token = localStorage.getItem('auth_token');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'token': token } : {}),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Fix for FormData: if Content-Type is explicitly undefined, remove it so fetch can set the right boundary
  if (mergedOptions.headers['Content-Type'] === undefined || mergedOptions.headers['Content-Type'] === 'undefined') {
    delete mergedOptions.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Check for 'message' (custom) or 'detail' (FastAPI default)
      const errorMsg = errorData.message || errorData.detail || `API Error: ${response.status}`;
      throw new Error(errorMsg);
    }

    return response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

export default API_URL;


