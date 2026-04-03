import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'] as const;

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
