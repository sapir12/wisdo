import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    libraries: {
      type: [Schema.Types.ObjectId],
      ref: 'Library',
      default: [],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>('User', userSchema);
