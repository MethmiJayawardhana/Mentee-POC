const pages = {
  login: document.getElementById('loginPage'),
  signup: document.getElementById('signupPage'),
};

const setActivePage = (pageName) => {
  Object.values(pages).forEach((el) => el?.classList.remove('active'));
  pages[pageName]?.classList.add('active');
};

const handleRoute = () => {
  const route = window.location.hash.replace('#', '') === 'signup' ? 'signup' : 'login';
  setActivePage(route);
  document.title = route === 'signup' ? 'Sign Up - Mentee POC' : 'Login - Mentee POC';
};

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
