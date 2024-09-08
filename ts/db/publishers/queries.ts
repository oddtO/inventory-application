import { sql } from "@pgtyped/runtime";
import { pool } from "../pool";
import {
  IAddPublisherQuery,
  IChangePublisherNameAndImgQuery,
  IChangePublisherNameOnlyQuery,
  ICountPublishersQuery,
  IDeletePublisherByIdQuery,
  IGetPublisherByIdQuery,
  IGetPublisherNamesQuery,
  IGetPublishersQuery,
  ISearchPublishersQuery,
} from "./queries.types";
import { IConvertGenreIdToNameQuery } from "../genres/queries.types";
import { ICheckIfNameIsAlreadyTakenQuery } from "../games/queries.types";

async function checkIfPublisherNameIsAlreadyTaken(
  name: string,
  currentItemId?: string,
) {
  const checkIfPublisherNameIsAlreadyTaken = sql<ICheckIfNameIsAlreadyTakenQuery>`
    SELECT
      name
    FROM
      publishers
    WHERE
      (
        name = $name
        AND (
          id <> $id
          OR $id IS NULL
        )
      );
  `;

  const results = await checkIfPublisherNameIsAlreadyTaken.run(
    { name, id: currentItemId },
    pool,
  );
  return results.length !== 0;
}
async function convertPublisherIdToName(id: number) {
  const convertPublisherIdToName = sql<IConvertGenreIdToNameQuery>`
    SELECT
      name
    FROM
      publishers
    WHERE
      id = $id
  `;

  const results = await convertPublisherIdToName.run({ id }, pool);
  return results[0]?.name;
}
function searchPublishers(query: string) {
  const searchPublishers = sql<ISearchPublishersQuery>`
    SELECT
      *
    FROM
      publishers
    WHERE
      name ILIKE $query
    ORDER BY 
      id;
  `;

  return searchPublishers.run({ query: `%${query}%` }, pool);
}
async function countPublishers() {
  const countPublishers = sql<ICountPublishersQuery>`
    SELECT
      COUNT(*)
    FROM
      publishers;
  `;

  return countPublishers.run(undefined, pool);
}
async function getPublisherById(id: number) {
  const getPublisherById = sql<IGetPublisherByIdQuery>`
    SELECT
      *
    FROM
      publishers
    WHERE
      id = $id
  `;

  const results = await getPublisherById.run({ id }, pool);
  return results[0];
}

async function getAllPublisherNames() {
  const getPublisherNames = sql<IGetPublisherNamesQuery>`
    SELECT
      p.id,
      p.name
    FROM
      public.publishers p
    ORDER BY
      p.id;
  `;

  const results = await getPublisherNames.run(undefined, pool);
  return results;
}
async function getAllPublishers() {
  const getPublishers = sql<IGetPublishersQuery>`
    SELECT
      *
    FROM
      public.publishers
    ORDER BY
      id;
  `;

  const results = await getPublishers.run(undefined, pool);

  return results;
}

async function addPublisher(name: string, imgBuf: Buffer, mimeType: string) {
  const addPublisher = sql<IAddPublisherQuery>`
    INSERT INTO
      public.publishers (name, image, mime_type)
    VALUES
      ($name, $image, $mime_type)
  `;

  await addPublisher.run({ name, image: imgBuf, mime_type: mimeType }, pool);
}

async function updatePublisher(
  id: number,
  name: string,
  imgBuf: Buffer | null,
  mimeType: string | null,
) {
  if (!imgBuf || !mimeType) {
    const changePublisherNameOnly = sql<IChangePublisherNameOnlyQuery>`
      UPDATE publishers
      SET
        name = $name
      WHERE
        id = $id
    `;

    await changePublisherNameOnly.run({ id, name }, pool);
  } else {
    const changePublisherNameAndImg = sql<IChangePublisherNameAndImgQuery>`
      UPDATE publishers
      SET
        name = $name,
      	image = $image,
      	mime_type = $mime_type
      WHERE
        id = $id
    `;

    await changePublisherNameAndImg.run(
      { id, name, image: imgBuf, mime_type: mimeType },
      pool,
    );
  }
}

async function deletePublisherById(id: number) {
  const deletePublisherById = sql<IDeletePublisherByIdQuery>`
    DELETE FROM publishers
    WHERE
      id = $id
  `;

  await deletePublisherById.run({ id }, pool);
}
export const publishersTable = {
  checkIfPublisherNameIsAlreadyTaken,
  convertPublisherIdToName,
  searchPublishers,
  countPublishers,
  getPublisherById,
  getAllPublisherNames,
  getAllPublishers,
  addPublisher,
  updatePublisher,
  deletePublisherById,
};
