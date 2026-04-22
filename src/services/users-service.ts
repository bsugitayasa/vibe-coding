import { db } from '../config/config';
import { users } from '../model/users-model';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../utils/users-utils';

export const getAllUsers = async () => {
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users);
};

export const getUserById = async (id: number) => {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).where(eq(users.id, id));
  return result[0];
};

export const createUser = async (data: any) => {
  const hashedPassword = await hashPassword(data.password);
  await db.insert(users).values({
    ...data,
    password: hashedPassword,
  });
  
  // Get the created user
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).where(eq(users.email, data.email));
  
  return result[0];
};

export const updateUser = async (id: number, data: any) => {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }
  
  await db.update(users).set(updateData).where(eq(users.id, id));
  
  return await getUserById(id);
};

export const deleteUser = async (id: number) => {
  const user = await getUserById(id);
  if (!user) return null;
  
  await db.delete(users).where(eq(users.id, id));
  return user;
};

export const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
};
