import mongoose, { Types } from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/db';
import { BookModel } from '../models/book.model';
import { LibraryModel } from '../models/library.model';
import { UserModel } from '../models/user.model';
import { booksSeed, librariesSeed, usersSeed } from './data';

async function seed(): Promise<void> {
  await connectToDatabase();

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

seed()
  .then(async () => {
    console.log('Database seeded successfully');
    await disconnectFromDatabase();
  })
  .catch(async (error) => {
    console.error('Failed to seed database', error);
    await mongoose.disconnect();
    process.exit(1);
  });
