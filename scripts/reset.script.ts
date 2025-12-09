import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { join } from "path";

import * as schema from "../src/db/schema";

const adminDBUrl = process.env.ADMIN_DB_URL;
const todoDbUrl = process.env.DATABASE_URL;
const todoDbName = todoDbUrl?.split(".").pop();

export const dropAndCreateDb = async () => {
  const adminPool = new Pool({ connectionString: adminDBUrl });
  await adminPool.query(
    `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1 AND pid <> pg_backend_pid()    
    `,
    [todoDbName]
  );
  await adminPool.query(`DROP DATABASE IF EXISTS "${todoDbName}"`);
  await adminPool.query(`CREATE DATABASE "${todoDbName}"`);
  await adminPool.end();
};

export const runMigration = async () => {
  const pool = new Pool({
    connectionString: todoDbUrl,
    max: 10,
    connectionTimeoutMillis: 30000,
  });

  const db = drizzle(pool, { schema, casing: "snake_case" });

  await migrate(db, { migrationsFolder: join(__dirname, "../src/db/drizzle") });
  await pool.end();
};

export const runSeed = async () => {
  const { execSync } = await import("child_process");
  execSync("bun run db:seed", { stdio: "inherit" });
};

export const main = async () => {
  console.log("Drop and Create Database");

  await dropAndCreateDb();

  console.log("Running Migration...");
  await runMigration();

  console.log("Seeding Migration...");
  await runSeed();

  console.log("Database reset migration completed");
};

main().catch((err) => console.log(err));
