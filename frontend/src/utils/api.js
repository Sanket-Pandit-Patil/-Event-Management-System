// Centralized API Base URL configuration for Production & Local Development
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  return response;
};

export default apiFetch;
