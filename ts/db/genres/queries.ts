import { pool } from "../pool";
import { sql } from "@pgtyped/runtime";
import {
  IAddGenreQuery,
  IGetAllGenreNamesQuery,
  IGetAllGenresQuery,
} from "./queries.types";

async function getAllGenreNames() {
  const getAllGenreNames = sql<IGetAllGenreNamesQuery>`
    SELECT
      g.id,
      g.name
    FROM
      public.genres g;
  `;

  const results = await getAllGenreNames.run(undefined, pool);
  return results;
}
async function getAllGenres() {
  const getAllGenres = sql<IGetAllGenresQuery>`
    SELECT
      *
    FROM
      public.genres;
  `;

  const results = await getAllGenres.run(undefined, pool);

  return results;
}
async function addNewGenre(name: string, imgBuf: Buffer, mimeType: string) {
  const addGenre = sql<IAddGenreQuery>`
    INSERT INTO
      public.genres (name, image, mime_type)
    VALUES
      ($name, $image, $mime_type)
  `;

  await addGenre.run({ name, image: imgBuf, mime_type: mimeType }, pool);
}

export const genresTable = {
  getAllGenreNames,
  getAllGenres,
  addNewGenre,
};
