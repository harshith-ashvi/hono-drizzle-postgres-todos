import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";

import { getTodosByUserId, insertTodo, insertUser, NewToDo } from "./queries";
import {
  createTestDb,
  destroyTestDb,
  TestDbContext,
} from "../test/setup-test-db";

let ctx: TestDbContext;

beforeEach(async () => {
  ctx = await createTestDb();

  await mock.module("../db/db.ts", () => ({
    db: ctx.db,
  }));
});

afterEach(async () => {
  await destroyTestDb(ctx);
});

describe("insertTodo", () => {
  it("should insert a todo into database", async () => {
    const userId = await insertUser({
      email: "test@gmail.com",
      password: "Hello@123",
    });
    const newTodo: NewToDo = {
      userId: userId,
      title: "Test Title",
      description: "This is test",
    };

    const todo = await insertTodo(newTodo);

    expect(todo.id).toBeDefined();
    expect(todo.userId).toBe(newTodo.userId);
  });
});

describe("getToDoByUserId", () => {
  it("should return todos for a given userId", async () => {
    const userId = await insertUser({
      email: "test@gmail.com",
      password: "Hello@123",
    });
    const todo1: NewToDo = {
      userId: userId,
      title: "Test Todo 1",
      description: "This is test",
    };
    const todo2: NewToDo = {
      userId: userId,
      title: "Test Todo 2",
      description: "This is test",
    };

    await insertTodo(todo1);
    await insertTodo(todo2);

    const todos = await getTodosByUserId(userId);

    expect(todos.length).toBe(2);
  });
});
