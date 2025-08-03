export const createAuthError = (message = 'Session expired. Please login again.') => {
  return {
    message,
    isAuthError: true // Flag to identify auth errors
  };
};