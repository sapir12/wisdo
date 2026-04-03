import { NextFunction, Response } from 'express';
import { createBookSchema, updateBookSchema } from '../validators/book.validator';
import * as bookService from '../services/book.service';
import { AppError } from '../utils/appError';
import { AuthenticatedUser } from '../types/auth';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

type BookIdParams = {
  id: string;
};

function requireUser(request: AuthenticatedRequest): AuthenticatedUser {
  if (!request.user) {
    throw new AppError('Unauthenticated request', 401);
  }

  return request.user;
}

export async function createBook(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = createBookSchema.parse(request.body);
    const user = requireUser(request);
    const book = await bookService.createBook(payload, user);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

export async function listBooks(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = requireUser(request);
    const libraryId = typeof request.query.library === 'string' ? request.query.library : undefined;
    const books = await bookService.listBooks(user, libraryId);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

export async function getBookById(
  request: AuthenticatedRequest<BookIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = requireUser(request);
    const book = await bookService.getBookById(request.params.id, user);
    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

export async function updateBook(
  request: AuthenticatedRequest<BookIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = updateBookSchema.parse(request.body);
    const user = requireUser(request);
    const book = await bookService.updateBook(request.params.id, payload, user);
    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(
  request: AuthenticatedRequest<BookIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = requireUser(request);
    await bookService.deleteBook(request.params.id, user);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
