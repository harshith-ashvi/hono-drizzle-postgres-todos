import { randomUUID } from "crypto";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "path";

import * as schema from "../db/schema";

export type TestDbContext = {
  pool: Pool;
  db: NodePgDatabase<typeof schema>;
  testDBName: string;
};

const adminDBUrl = process.env.ADMIN_DB_URL;

export const createTestDb = async (): Promise<TestDbContext> => {
  const testDBName = `test_db_${randomUUID().replace("/-/g", "")}`;
  const testDBURL = `postgres://user:password@localhost:5432/${testDBName}`;

  const adminPool = new Pool({ connectionString: adminDBUrl });
  await adminPool.query(`CREATE DATABASE "${testDBName}"`);
  await adminPool.end();

  const pool = new Pool({
    connectionString: testDBURL,
    max: 10,
    connectionTimeoutMillis: 30000,
  });

  const db = drizzle(pool, { schema, casing: "snake_case" });

  await migrate(db, { migrationsFolder: join(__dirname, "../db/drizzle") });

  return { pool, db, testDBName };
};

export const destroyTestDb = async ({ pool, testDBName }: TestDbContext) => {
  await pool.end();

  const adminPool = new Pool({ connectionString: adminDBUrl });
  await adminPool.query(
    `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1 AND pid <> pg_backend_pid()    
    `,
    [testDBName]
  );
  await adminPool.query(`DROP DATABASE IF EXIST "${testDBName}`);
  await adminPool.end();
};
