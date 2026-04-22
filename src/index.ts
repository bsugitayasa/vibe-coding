import { Elysia } from 'elysia';
import { db } from './db';
import { users } from './db/schema';

const app = new Elysia()
  .get('/', () => 'Hello Elysia!')
  .get('/users', async () => {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error(error);
      return { error: 'Database connection failed. Please check your .env configuration.' };
    }
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
