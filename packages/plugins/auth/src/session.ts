import crypto from 'crypto';
import { Session, AuthPluginOptions } from './types';

// In-memory session store (in a real implementation, this would use a database)
const sessionStore = new Map<string, Session>();

export const createSession = async (
  userId: string,
  options: AuthPluginOptions = {}
): Promise<string> => {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const maxAge = options.sessionMaxAge || 24 * 60 * 60 * 1000; // 24 hours default
  
  const session: Session = {
    userId,
    createdAt: now,
    expiresAt: now + maxAge,
    data: {}
  };
  
  sessionStore.set(sessionId, session);
  
  // Clean up expired sessions periodically
  cleanupExpiredSessions();
  
  return sessionId;
};

export const getSession = async (
  sessionId: string,
  secret: string | undefined
): Promise<Session | null> => {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return null;
  }
  
  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    return null;
  }
  
  return session;
};

export const destroySession = async (sessionId: string): Promise<void> => {
  sessionStore.delete(sessionId);
};

const cleanupExpiredSessions = (): void => {
  const now = Date.now();
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      sessionStore.delete(sessionId);
    }
  }
};