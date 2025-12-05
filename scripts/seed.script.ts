import { seed } from "drizzle-seed";

import * as schema from "../src/db/schema";
import { db, pool } from "../src/db/db";

export const seedDB = async () => {
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
