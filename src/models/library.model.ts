import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const librarySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type Library = InferSchemaType<typeof librarySchema>;
export type LibraryDocument = HydratedDocument<Library>;

export const LibraryModel = model<Library>('Library', librarySchema);
