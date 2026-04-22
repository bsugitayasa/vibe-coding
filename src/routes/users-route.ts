import { Elysia, t } from 'elysia';
import * as usersController from '../controller/users-controller';

export const usersRoute = new Elysia({ prefix: '/users' })
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUserById)
  .post('/', usersController.createUser, {
    body: t.Object({
      name: t.String({ maxLength: 50 }),
      email: t.String({ format: 'email', maxLength: 100 }),
      password: t.String({ maxLength: 255 })
    })
  })
  .put('/:id', usersController.updateUser, {
    body: t.Object({
      name: t.Optional(t.String({ maxLength: 50 })),
      email: t.Optional(t.String({ format: 'email', maxLength: 100 })),
      password: t.Optional(t.String({ maxLength: 255 }))
    })
  })
  .delete('/:id', usersController.deleteUser);
