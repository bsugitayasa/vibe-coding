import * as usersService from '../services/users-service';

export const getAllUsers = async () => {
  const users = await usersService.getAllUsers();
  return { users };
};

export const getUserById = async ({ params: { id }, set }: any) => {
  const user = await usersService.getUserById(Number(id));
  if (!user) {
    set.status = 404;
    return { error: 'User tidak ditemukan' };
  }
  return { user };
};

export const createUser = async ({ body, set }: any) => {
  const existingUser = await usersService.getUserByEmail(body.email);
  if (existingUser) {
    set.status = 409;
    return { error: 'Email sudah terdaftar' };
  }
  
  const user = await usersService.createUser(body);
  set.status = 201;
  return {
    message: 'User berhasil ditambahkan',
    user
  };
};

export const updateUser = async ({ params: { id }, body, set }: any) => {
  const userExists = await usersService.getUserById(Number(id));
  if (!userExists) {
    set.status = 404;
    return { error: 'User tidak ditemukan' };
  }

  if (body.email && body.email !== userExists.email) {
    const existingUser = await usersService.getUserByEmail(body.email);
    if (existingUser) {
      set.status = 409;
      return { error: 'Email sudah terdaftar' };
    }
  }

  const user = await usersService.updateUser(Number(id), body);
  return {
    message: 'User berhasil diupdate',
    user
  };
};

export const deleteUser = async ({ params: { id }, set }: any) => {
  const user = await usersService.deleteUser(Number(id));
  if (!user) {
    set.status = 404;
    return { error: 'User tidak ditemukan' };
  }
  return {
    message: 'User berhasil dihapus',
    user
  };
};
