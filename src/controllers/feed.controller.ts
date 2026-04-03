import { NextFunction, Response } from 'express';
import * as feedService from '../services/feed.service';
import { AppError } from '../utils/appError';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export async function getFeed(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.user) {
      throw new AppError('Unauthenticated request', 401);
    }

    const feed = await feedService.getFeed(request.user);
    response.status(200).json(feed);
  } catch (error) {
    next(error);
  }
}
