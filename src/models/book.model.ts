import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorCountry: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    library: {
      type: Schema.Types.ObjectId,
      ref: 'Library',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

bookSchema.index({ library: 1, authorCountry: 1, pages: -1, publishedDate: 1 });

export type Book = InferSchemaType<typeof bookSchema>;
export type BookDocument = HydratedDocument<Book>;

export const BookModel = model<Book>('Book', bookSchema);
