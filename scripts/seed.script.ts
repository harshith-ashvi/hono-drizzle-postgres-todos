import { reset, seed } from "drizzle-seed";

import * as schema from "../src/db/schema";
import { db, pool } from "../src/db/db";

export const seedDB = async () => {
  await reset(db, schema);

  await seed(db, schema).refine((func) => ({
    usersTable: {
      columns: {
        age: func.int({ minValue: 13, maxValue: 100 }),
      },
      count: 10,
      with: {
        todosTable: 10,
      },
    },
    todosTable: {
      columns: {
        title: func.valuesFromArray({
          values: [
            "Buy groceries",
            "Walk the dog",
            "Read a book",
            "Write some code",
            "Go for a run",
            "Clean the house",
            "Practice guitar",
            "Prepare dinner",
            "Call a friend",
            "Plan the week",
          ],
        }),
        description: func.valuesFromArray({
          values: [
            "Do this with care and attention",
            "Remember to stay focused while doing it",
            "Make sure to give yourself enough time",
            "Try to enjoy the process",
            "Do not forget to take a small break afterward",
            "Stay consistent and keep it simple",
            "Keep things organized as you go",
            "Do it step by step without rushing",
            "Pay attention to small details",
            "Make sure to finish it completely before moving on",
          ],
        }),
      },
    },
  }));
};

seedDB()
  .then(() => {
    console.log("DB seed successful");
    return pool.end();
  })
  .catch((err) => {
    console.log("Error in seed", err);
    return pool.end();
  });
