import { Hono } from "hono";
import { UUID } from "crypto";

import { getTodosByUserId } from "./db/queries";

const app = new Hono();

app.get("/todos", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "No User ID provided" }, 400);
  }

  try {
    const todos = getTodosByUserId(userId as UUID);
    return c.json(todos, 200);
  } catch (err) {
    console.log("Error fetching todos", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
