import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        // intentionally not showing path to not reveal code base to end user
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: 'Internal server error' });
}
