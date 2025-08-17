import { JwtPayload, AuthPluginOptions } from './types';

// Mock JWT functions (in a real implementation, you would use the jsonwebtoken library)
export const createJwtToken = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string | undefined,
  options: AuthPluginOptions = {}
): string => {
  if (!secret) {
    throw new Error('JWT secret is required');
  }
  
  // In a real implementation, you would use:
  // return jwt.sign(payload, secret, { expiresIn: '1h', issuer: options.jwtIssuer, audience: options.jwtAudience });
  
  // Mock implementation for now
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyJwtToken = (
  token: string,
  secret: string | undefined
): JwtPayload => {
  if (!secret) {
    throw new Error('JWT secret is required');
  }
  
  // In a real implementation, you would use:
  // return jwt.verify(token, secret) as JwtPayload;
  
  // Mock implementation for now
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};