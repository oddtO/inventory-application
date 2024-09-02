import { sql } from "@pgtyped/runtime";
import { pool } from "./pool";
import { publishersTable } from "./publishers/queries";
import { genresTable } from "./genres/queries";
import { gameTable } from "./games/queries";
import { IAddImgQuery, IQueryTableQuery } from "./queries.types";

async function getAllTest() {
  const queryTable = sql<IQueryTableQuery>`
    SELECT
      t.data
    FROM
      public.test_table t;
  `;

  const results = await queryTable.run(undefined, pool);
  return results;
}

async function addImgTest(buf: Buffer) {
  const addImg = sql<IAddImgQuery>`
    INSERT INTO
      public.test_table (data)
    VALUES
      ($data)
  `;

  await addImg.run({ data: buf }, pool);
}
export const db = {
  getAllTest,
  addImgTest,
  ...publishersTable,
  ...genresTable,
  ...gameTable,
};
