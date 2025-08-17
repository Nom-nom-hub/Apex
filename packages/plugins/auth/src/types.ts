export interface AuthPluginOptions {
  jwtSecret?: string;
  sessionSecret?: string;
  cookieName?: string;
  jwtIssuer?: string;
  jwtAudience?: string;
  sessionMaxAge?: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

export interface JwtPayload {
  userId: string;
  username: string;
  email?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface Session {
  userId: string;
  createdAt: number;
  expiresAt: number;
  data?: Record<string, any>;
}