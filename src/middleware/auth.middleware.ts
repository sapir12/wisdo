import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { AuthenticatedUser } from '../types/auth';

export type AuthenticatedRequest<P = Record<string, string>, ReqBody = unknown> = Request<P, unknown, ReqBody> & {
  user?: AuthenticatedUser;
};

export function authenticate(request: AuthenticatedRequest, _response: Response, next: NextFunction): void {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', 401));
  }

  const token = authorizationHeader.replace('Bearer ', '');

  try {
    request.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
