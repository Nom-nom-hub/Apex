import { AuthPluginOptions, User } from './types';
import { verifyJwtToken } from './jwt';
import { getSession } from './session';

export const createAuthMiddleware = (options: AuthPluginOptions) => {
  return async (context: any) => {
    try {
      // Extract token from cookies or Authorization header
      let token: string | null = null;
      
      // Check cookies first
      if (context.request.cookies) {
        const cookieName = options.cookieName || 'auth-token';
        token = context.request.cookies[cookieName];
      }
      
      // Check Authorization header if no token in cookies
      if (!token && context.request.headers.authorization) {
        const authHeader = context.request.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      
      // If we have a token, verify it
      if (token) {
        try {
          const payload = await verifyJwtToken(token, options.jwtSecret);
          context.user = {
            id: payload.userId,
            username: payload.username,
            email: payload.email,
            roles: payload.roles
          };
        } catch (error) {
          console.warn('Invalid JWT token:', error);
        }
      }
      
      // If we don't have a user from JWT, check session
      if (!context.user) {
        const sessionId = context.request.cookies?.sessionId;
        if (sessionId) {
          try {
            const session = await getSession(sessionId, options.sessionSecret);
            if (session) {
              context.user = {
                id: session.userId,
                // Add other user properties from session if needed
              };
            }
          } catch (error) {
            console.warn('Invalid session:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error in auth middleware:', error);
    }
    
    // Continue to next middleware
    if (context.next) {
      context.next();
    }
  };
};