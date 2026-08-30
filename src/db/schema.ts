// src/db/schema.ts
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (maps to Firebase Auth UID & ChatMi profiles)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email'),
  phoneNumber: text('phone_number'),
  avatar: text('avatar'),
  status: text('status').default('offline'),
  statusText: text('status_text'),
  role: text('role').default('member'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chats / Conversations table
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  chatId: text('chat_id').notNull().unique(),
  name: text('name').notNull(),
  isGroup: boolean('is_group').default(false),
  avatar: text('avatar'),
  lastMessage: text('last_message'),
  lastMessageTimestamp: text('last_message_timestamp'),
  unreadCount: integer('unread_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  messageId: text('message_id').notNull().unique(),
  chatId: text('chat_id').notNull(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  text: text('text').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').default('sent'), // sent, delivered, read
  mediaType: text('media_type'),
  mediaUrl: text('media_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User relationships
export const usersRelations = relations(users, ({ many }) => ({
  messages: many(messages),
}));
