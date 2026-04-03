import { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';

export async function login(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const payload = loginSchema.parse(request.body);
    const token = await authService.login(payload.username, payload.password);
    response.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}
