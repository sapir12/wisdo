import { UserModel } from '../models/user.model';
import { AppError } from '../utils/appError';
import { signToken } from '../utils/jwt';

export async function login(username: string, password: string): Promise<string> {
  const user = await UserModel.findOne({ username }).lean();

  if (!user || user.password !== password) {
    throw new AppError('Invalid username or password', 401);
  }

  return signToken({
    id: user._id.toString(),
    username: user.username,
    country: user.country,
    libraries: user.libraries.map((libraryId) => libraryId.toString()),
    role: user.role,
  });
}
