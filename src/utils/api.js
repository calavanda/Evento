export const getApiUrl = () => {
  // Prefer local URL in development if available
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_URL_LOCAL) {
    return process.env.REACT_APP_API_URL_LOCAL;
  }
  
  // Fallback to REACT_APP_API_URL or the production Vercel backend
  let apiUrl = (process.env.REACT_APP_API_URL || 'https://evento-backend-liard.vercel.app').replace(/\/+$/, '');
  
  if (apiUrl.startsWith('http')) {
    return apiUrl;
  }
  
  return `https://${apiUrl}`;
};
