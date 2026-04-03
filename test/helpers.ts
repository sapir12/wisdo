import { Types } from 'mongoose';
import request from 'supertest';
import { createApp } from '../src/app';
import { connectToDatabase, disconnectFromDatabase } from '../src/config/db';
import { BookModel } from '../src/models/book.model';
import { LibraryModel } from '../src/models/library.model';
import { UserModel } from '../src/models/user.model';
import { booksSeed, librariesSeed, usersSeed } from '../src/seed/data';

export const app = createApp();

export async function setupTestDatabase(): Promise<void> {
  await connectToDatabase();
}

export async function teardownTestDatabase(): Promise<void> {
  await disconnectFromDatabase();
}

export async function resetDatabase(): Promise<void> {
  await Promise.all([
    BookModel.deleteMany({}),
    UserModel.deleteMany({}),
    LibraryModel.deleteMany({}),
  ]);

  await LibraryModel.insertMany(
    librariesSeed.map((library) => ({
      ...library,
      _id: new Types.ObjectId(library._id),
    })),
  );

  await UserModel.insertMany(
    usersSeed.map((user) => ({
      ...user,
      libraries: user.libraries.map((libraryId) => new Types.ObjectId(libraryId)),
    })),
  );

  await BookModel.insertMany(
    booksSeed.map((book) => ({
      ...book,
      library: new Types.ObjectId(book.library),
    })),
  );
}

export async function loginAndGetToken(username: string, password: string): Promise<string> {
  const response = await request(app)
    .post('/login')
    .send({ username, password });

  return response.body.token;
}
