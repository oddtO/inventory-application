import { pool } from "../pool";
import { sql } from "@pgtyped/runtime";
import {
  IAddGameQuery,
  IAssignGenresToGameQuery,
  IGetAllGamesQuery,
} from "./queries.types";

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

export const gameTable = {
  getAllGames,
  addGame,
};
