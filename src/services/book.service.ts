import { FilterQuery, Types } from 'mongoose';
import { BookModel, BookDocument } from '../models/book.model';
import { AppError } from '../utils/appError';
import { AuthenticatedUser } from '../types/auth';

interface CreateBookInput {
  title: string;
  author: string;
  authorCountry: string;
  publishedDate: Date;
  pages: number;
  library: string;
}

type UpdateBookInput = Partial<CreateBookInput>;

function ensureLibraryAccess(user: AuthenticatedUser, libraryId: string): void {
  if (!user.libraries.includes(libraryId)) {
    throw new AppError('You do not have access to this library', 403);
  }
}

async function getAccessibleBookOrThrow(bookId: string, user: AuthenticatedUser): Promise<BookDocument> {
  const book = await BookModel.findById(bookId);

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  ensureLibraryAccess(user, book.library.toString());
  return book;
}

export async function createBook(payload: CreateBookInput, user: AuthenticatedUser) {
  ensureLibraryAccess(user, payload.library);

  return BookModel.create({
    ...payload,
    library: new Types.ObjectId(payload.library),
  });
}

export async function listBooks(user: AuthenticatedUser, libraryId?: string) {
  const query: FilterQuery<BookDocument> = {
    library: { $in: user.libraries.map((id) => new Types.ObjectId(id)) },
  };

  if (libraryId) {
    ensureLibraryAccess(user, libraryId);
    query.library = new Types.ObjectId(libraryId);
  }

  return BookModel.find(query).sort({ createdAt: -1 }).lean();
}

export async function getBookById(bookId: string, user: AuthenticatedUser) {
  const book = await getAccessibleBookOrThrow(bookId, user);
  return book.toObject();
}

export async function updateBook(bookId: string, payload: UpdateBookInput, user: AuthenticatedUser) {
  const book = await getAccessibleBookOrThrow(bookId, user);

  if (payload.library) {
    ensureLibraryAccess(user, payload.library);
    book.library = new Types.ObjectId(payload.library);
  }

  if (payload.title !== undefined) book.title = payload.title;
  if (payload.author !== undefined) book.author = payload.author;
  if (payload.authorCountry !== undefined) book.authorCountry = payload.authorCountry;
  if (payload.publishedDate !== undefined) book.publishedDate = payload.publishedDate;
  if (payload.pages !== undefined) book.pages = payload.pages;

  await book.save();
  return book.toObject();
}

export async function deleteBook(bookId: string, user: AuthenticatedUser) {
  const book = await getAccessibleBookOrThrow(bookId, user);
  await book.deleteOne();
}
