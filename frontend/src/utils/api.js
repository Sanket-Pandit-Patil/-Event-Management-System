// Centralized API Base URL configuration for Production & Local Development
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error(
      'Backend URL is returning HTML. Please ensure VITE_API_URL is set in Vercel settings to your live Render backend URL.'
    );
  }

  return response;
};

export default apiFetch;
