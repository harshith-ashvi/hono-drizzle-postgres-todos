import { describe, expect, it } from "bun:test";
import { insertTodo, NewToDo } from "./queries";

describe("insertTodo", () => {
  it("should insert a todo into database", async () => {
    const newTodo: NewToDo = {
      userId: "a97842d1-6f70-4e88-164c-f04a3e475fa7",
      title: "Test Title",
      description: "This is test",
    };

    const todo = await insertTodo(newTodo);

    expect(todo.id).toBeDefined();
    expect(todo.userId).toBe(newTodo.userId);
  });
});
