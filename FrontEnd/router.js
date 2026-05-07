const pages = {
  login: document.getElementById('loginPage'),
  signup: document.getElementById('signupPage'),
};

const setActivePage = (pageName) => {
  try {
    if (!pages[pageName]) {
      console.error(`Page '${pageName}' not found`);
      return;
    }
    Object.values(pages).forEach((el) => el?.classList.remove('active'));
    pages[pageName]?.classList.add('active');
  } catch (error) {
    console.error('Error setting active page:', error);
  }
};

const handleRoute = () => {
  try {
    const route = window.location.hash.replace('#', '') === 'signup' ? 'signup' : 'login';
    setActivePage(route);
    document.title = route === 'signup' ? 'Sign Up - Mentee POC' : 'Login - Mentee POC';
  } catch (error) {
    console.error('Routing error:', error);
  }
};

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
