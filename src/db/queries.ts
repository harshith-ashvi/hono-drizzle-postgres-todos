import type { UUID } from "crypto";
import { desc, eq } from "drizzle-orm";

import { todosTable, usersTable } from "./schema";
import { db } from "./db";

export type NewToDo = {
  userId: UUID;
  title: string;
  description?: string;
  completed?: boolean;
};

export type NewUser = {
  email: string;
  password: string;
  age?: number;
};

export const getTodosByUserId = async (userId: UUID) => {
  const todos = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.userId, userId))
    .orderBy(desc(todosTable.createdAt));

  return todos;
};

export const insertTodo = async (todo: NewToDo) => {
  const [createdToDo] = await db.insert(todosTable).values(todo).returning();
  return createdToDo;
};

export const insertUser = async (user: NewUser) => {
  const passwordHash = await Bun.password.hash(user.password);
  const [newUser] = await db
    .insert(usersTable)
    .values({ ...user, passwordHash })
    .returning();
  return newUser.id as UUID;
};
