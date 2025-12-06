import type { UUID } from "crypto";
import { desc, eq } from "drizzle-orm";

import { todosTable } from "./schema";
import { db } from "./db";

type NewToDo = {
  userId: UUID;
  title: string;
  description?: string;
  completed?: boolean;
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
