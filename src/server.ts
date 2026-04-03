import { createApp } from './app';
import { connectToDatabase } from './config/db';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectToDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap application', error);
  process.exit(1);
});
