export interface AuthenticatedUser {
  id: string;
  username: string;
  country: string;
  libraries: string[];
  role?: 'admin' | 'user';
}
