import { pool } from "../pool";
import { sql } from "@pgtyped/runtime";
import {
  IAddGenreQuery,
  IChangeGenreNameAndImgQuery,
  IChangeGenreNameOnlyQuery,
  IGetAllGenreNamesQuery,
  IGetAllGenresQuery,
  IGetGenreByIdQuery,
} from "./queries.types";

async function getGenreById(id: number) {
  const getGenreById = sql<IGetGenreByIdQuery>`
    SELECT
      *
    FROM
      genres
    WHERE
      id = $id;
  `;

  const results = await getGenreById.run({ id }, pool);
  return results[0];
}

async function getAllGenreNames() {
  const getAllGenreNames = sql<IGetAllGenreNamesQuery>`
    SELECT
      g.id,
      g.name
    FROM
      public.genres g
    ORDER BY
      g.id;
  `;

  const results = await getAllGenreNames.run(undefined, pool);
  return results;
}
async function getAllGenres() {
  const getAllGenres = sql<IGetAllGenresQuery>`
    SELECT
      *
    FROM
      public.genres
    ORDER BY
      id;
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

async function updateGenre(
  id: number,
  name: string,
  imgBuf: Buffer | null,
  mimeType: string | null,
) {
  if (!imgBuf || !mimeType) {
    const changeGenreNameOnly = sql<IChangeGenreNameOnlyQuery>`
      UPDATE genres
      SET
        name = $name
      WHERE
        id = $id
    `;

    await changeGenreNameOnly.run({ id, name }, pool);
  } else {
    const changeGenreNameAndImg = sql<IChangeGenreNameAndImgQuery>`
      UPDATE genres
      SET
        name = $name,
      	image = $image,
      	mime_type = $mime_type
      WHERE
        id = $id
    `;

    await changeGenreNameAndImg.run(
      { id, name, image: imgBuf, mime_type: mimeType },
      pool,
    );
  }
}

export const genresTable = {
  getGenreById,
  getAllGenreNames,
  getAllGenres,
  addNewGenre,
  updateGenre,
};
