// Apex meta-package - bundles all essential packages for beginners

// Placeholder exports for the runtime
export const scanRoutes = () => [];
export const matchRoute = () => null;
export const renderPage = async () => ({ html: '' });
export const DevServer = class {};

// Default export
export default {
  scanRoutes,
  matchRoute,
  renderPage,
  DevServer
};