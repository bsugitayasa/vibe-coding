import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { usersRoute } from './routes/users-route';

export const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: 'frontend',
    prefix: '/frontend'
  }))
  .use(swagger())
  .get('/', () => ({ message: 'Welcome to Vibe API' }))
  .use(usersRoute);
