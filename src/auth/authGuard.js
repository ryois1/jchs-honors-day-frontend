import { getInstance } from "./index";
export const authGuard = (to, from, next) => {
  const authService = getInstance();
  const fn = () => {
    if (authService.isAuthenticated) {
      return next();
    }
    authService.loginWithRedirect({ connection: 'azuread', redirect_uri: to.fullPath, appState: { targetUrl: to.fullPath } });
  };
  if (!authService.loading) {
    return fn();
  }
  authService.$watch("loading", loading => {
    if (loading === false) {
      return fn();
    }
  });
};