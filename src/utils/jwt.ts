import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedUser } from '../types/auth';

export function signToken(user: AuthenticatedUser): string {
  return jwt.sign(user, env.jwtSecret, { expiresIn: '1h' });
}

export function verifyToken(token: string): AuthenticatedUser {
  return jwt.verify(token, env.jwtSecret) as AuthenticatedUser;
}
