import { sql } from "@pgtyped/runtime";
import { pool } from "./pool";
import { IQueryTableQuery } from "./queries.types";
async function getAllTest() {
  const queryTable = sql<IQueryTableQuery>`
    SELECT
      t.name
    FROM
      public.test_table t;
  `;

  const results = await queryTable.run(undefined, pool);
  return results;
}

export const db = {
  getAllTest,
};
