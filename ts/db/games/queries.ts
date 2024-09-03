import { pool } from "../pool";
import { sql } from "@pgtyped/runtime";
import {
  IAddGameQuery,
  IAssignGenresToGameQuery,
  IDeleteGenresFromGameQuery,
  IGetAllGamesQuery,
  IGetGameByIdQuery,
  IReassignGenresToGameQuery,
  IUpdateGameAndImgQuery,
  IUpdateGameButLeaveImgQuery,
} from "./queries.types";

async function getGameById(id: number) {
  const getGameById = sql<IGetGameByIdQuery>`
    SELECT
      g.id,
      g.name AS name,
      p."id" AS publisher_id,
      ARRAY_AGG(
        ge."id"
        ORDER BY
          ge.id
      ) AS genreids,
      STRING_AGG(
        ge."name",
        ', '
        ORDER BY
          ge."id"
      ) AS genrenames
    FROM
      games g
      JOIN publishers p ON g.publisher_id = p.id
      JOIN game_genres gg ON g.id = gg.game_id
      JOIN genres ge ON ge.id = gg.genre_id
    WHERE 
      g.id = $id
    GROUP BY
      g.id,
      p."id";
  `;

  const results = await getGameById.run({ id }, pool);
  return results;
}
async function getAllGames() {
  const getAllGames = sql<IGetAllGamesQuery>`
    SELECT
      g.id,
      g.name AS game_name,
      p."name" AS publisher_name,
      STRING_AGG(
        ge."name",
        ', '
        ORDER BY
          ge."name"
      ) AS genres,
      g.mime_type,
      g.image
    FROM
      games g
      JOIN publishers p ON g.publisher_id = p.id
      JOIN game_genres gg ON g.id = gg.game_id
      JOIN genres ge ON ge.id = gg.genre_id
    GROUP BY
      g.id,
      p."name";
  `;

  const results = await getAllGames.run(undefined, pool);

  return results;
}

async function addGame(
  name: string,
  imgBuf: Buffer,
  mime_type: string,
  publisher_id: number,
  genre_ids: number[],
) {
  await pool.query("BEGIN");
  const addGame = sql<IAddGameQuery>`
    INSERT INTO
      games (name, image, mime_type, publisher_id)
    VALUES
      (
        $name,
        $image,
	$mime_type,
        $publisher_id
      )
    RETURNING
      id
  `;

  const results = await addGame.run(
    { name, image: imgBuf, mime_type, publisher_id },
    pool,
  );

  const insertedGameId = +results[0].id;
  const genreData = genre_ids.map((genreId) => {
    return { insertedGameId, genreId };
  });

  const assignGenresToGame = sql<IAssignGenresToGameQuery>`
    INSERT INTO
      game_genres (game_id, genre_id)
    VALUES
      $$genreData(insertedGameId, genreId)
  `;

  await assignGenresToGame.run({ genreData }, pool);

  await pool.query("COMMIT");
}

async function updateGame(
  id: number,
  name: string,
  publisherId: number,
  imgBuf: Buffer | null,
  mimeType: string | null,
  genreIds: string[],
) {
  await pool.query("BEGIN");
  if (!imgBuf || !mimeType) {
    const updateGameButLeaveImg = sql<IUpdateGameButLeaveImgQuery>`
      UPDATE games
      SET
        name = $name,
        publisher_id = $publisher_id
      WHERE
        id = $id;
    `;

    await updateGameButLeaveImg.run(
      { name, publisher_id: publisherId, id },
      pool,
    );
  } else {
    const updateGameAndImg = sql<IUpdateGameAndImgQuery>`
      UPDATE games
      SET
        name = $name,
        publisher_id = $publisher_id,
        image = $image,
        mime_type = $mime_type
      WHERE
        id = $id;
    `;

    await updateGameAndImg.run(
      {
        name,
        publisher_id: publisherId,
        image: imgBuf,
        mime_type: mimeType,
        id,
      },
      pool,
    );
  }

  const deleteGenresFromGame = sql<IDeleteGenresFromGameQuery>`
    DELETE FROM game_genres
    WHERE
      game_id = $id;
  `;

  await deleteGenresFromGame.run({ id }, pool);
  const reassignGenresToGame = sql<IReassignGenresToGameQuery>`
    INSERT INTO
      game_genres
    VALUES
      $$genreIds(insertedGameId, genreId);
  `;

  const genreData = genreIds.map((genreId) => {
    return { insertedGameId: id, genreId };
  });

  await reassignGenresToGame.run({ genreIds: genreData }, pool);
  await pool.query("COMMIT");
}

export const gameTable = {
  getGameById,
  getAllGames,
  addGame,
  updateGame,
};
