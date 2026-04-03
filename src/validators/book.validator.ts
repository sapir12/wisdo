import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createBookSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  author: z.string().trim().min(1, 'author is required'),
  authorCountry: z.string().trim().min(1, 'authorCountry is required'),
  publishedDate: z.coerce.date(),
  pages: z.number().int().positive('pages must be greater than 0'),
  library: z.string().regex(objectIdRegex, 'library must be a valid MongoDB ObjectId'),
});

export const updateBookSchema = createBookSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'at least one field must be provided',
);
