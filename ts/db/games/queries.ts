import { pool } from "../pool";
import { sql } from "@pgtyped/runtime";
import {
  IAddGameQuery,
  IAssignGenresToGameQuery,
  ICountGamesQuery,
  IDeleteGameByIdQuery,
  IDeleteGenresFromGameQuery,
  IGetAllGamesQuery,
  IGetFiveLatestGamesQuery,
  IGetGameByIdQuery,
  IReassignGenresToGameQuery,
  ISearchGamesQuery,
  IUpdateGameAndImgQuery,
  IUpdateGameButLeaveImgQuery,
} from "./queries.types";

function searchGames(query: string) {
  const searchGames = sql<ISearchGamesQuery>`
    SELECT
      g.id,
      g.name AS game_name,
      p.name AS publisher_name,
      STRING_AGG(
        ge."name",
        ', '
        ORDER BY
          ge."id"
      ) AS genres,
      g.mime_type,
      g.image
    FROM
      games g
      JOIN publishers p ON g.publisher_id = p.id
      LEFT JOIN game_genres gg ON g.id = gg.game_id
      LEFT JOIN genres ge ON ge.id = gg.genre_id
    WHERE
      g.name ILIKE $query
    GROUP BY
      g.id,
      p."name"
    ORDER BY
      g.id;
  `;

  return searchGames.run({ query: `%${query}%` }, pool);
}
function getFiveLatestGames() {
  const getFiveLatestGames = sql<IGetFiveLatestGamesQuery>`
    SELECT
      g.id,
      g.name AS game_name,
      p.name AS publisher_name,
      STRING_AGG(
        ge."name",
        ', '
        ORDER BY
          ge."id"
      ) AS genres,
      g.mime_type,
      g.image
    FROM
      games g
      JOIN publishers p ON g.publisher_id = p.id
      LEFT JOIN game_genres gg ON g.id = gg.game_id
      LEFT JOIN genres ge ON ge.id = gg.genre_id
    GROUP BY
      g.id,
      p."id"
    ORDER BY
      g.id DESC
    LIMIT
      5
  `;

  return getFiveLatestGames.run(undefined, pool);
}

async function countGames() {
  const countGames = sql<ICountGamesQuery>`
    SELECT
      COUNT(*)
    FROM
      games;
  `;

  return countGames.run(undefined, pool);
}
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
      LEFT JOIN game_genres gg ON g.id = gg.game_id
      LEFT JOIN genres ge ON ge.id = gg.genre_id
    WHERE 
      g.id = $id
    GROUP BY
      g.id,
      p."id" ;
  `;

  const results = await getGameById.run({ id }, pool);
  return results;
}
async function getAllGames(genreId: number | null, publisherId: number | null) {
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
      ARRAY_AGG(
        ge."id"
        ORDER BY
          ge.id
      ) AS genreids,
      g.mime_type,
      g.image
    FROM
      games g
      JOIN publishers p ON g.publisher_id = p.id
      LEFT JOIN game_genres gg ON g.id = gg.game_id
      LEFT JOIN genres ge ON ge.id = gg.genre_id
    WHERE
      (
        p.id = $publisherId OR
        $publisherId IS NULL
      )
    GROUP BY
      g.id,
      p."name"
    HAVING
      (
        $genreId = ANY (ARRAY_AGG(ge.id))
        OR $genreId IS NULL
      )
    ORDER BY
      g.id;
  `;

  const results = await getAllGames.run({ genreId, publisherId }, pool);

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

async function deleteGameById(id: number) {
  const deleteGameById = sql<IDeleteGameByIdQuery>`
    DELETE FROM games
    WHERE
      id = $id
  `;

  await deleteGameById.run({ id }, pool);
}

export const gameTable = {
  searchGames,
  getFiveLatestGames,
  countGames,

  getGameById,
  getAllGames,
  addGame,
  updateGame,
  deleteGameById,
};
