// src/db/users.ts
import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, data: { name: string; email?: string; phoneNumber?: string; avatar?: string }) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        name: data.name,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        avatar: data.avatar || null,
        status: 'online',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name: data.name,
          email: data.email || null,
          phoneNumber: data.phoneNumber || null,
          avatar: data.avatar || null,
          status: 'online',
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database user registration failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Database query failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
