// Authentication utility functions
const STORAGE_KEY = 'DocBook';

export const auth = {
  // Get current user from session storage
  getUser: () => {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Set user in session storage
  setUser: (userData) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  },

  // Remove user from session storage
  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = auth.getUser();
    return user?.isAdmin === true;
  },

  // Check if user is doctor
  isDoctor: () => {
    const user = auth.getUser();
    return user?.isDoctor === true;
  },

  // Check if user is patient
  isPatient: () => {
    const user = auth.getUser();
    return !user?.isAdmin && !user?.isDoctor;
  },

  // Get user ID
  getUserId: () => {
    const user = auth.getUser();
    return user?.id;
  },

  // Get username
  getUsername: () => {
    const user = auth.getUser();
    return user?.username || '';
  },

  // Get user email
  getEmail: () => {
    const user = auth.getUser();
    return user?.email || '';
  }
};
