import { sql } from "@pgtyped/runtime";
import { pool } from "../pool";
import {
  IAddPublisherQuery,
  IChangePublisherNameAndImgQuery,
  IChangePublisherNameOnlyQuery,
  IGetPublisherByIdQuery,
  IGetPublisherNamesQuery,
  IGetPublishersQuery,
} from "./queries.types";

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
      public.publishers p;
  `;

  const results = await getPublisherNames.run(undefined, pool);
  return results;
}
async function getAllPublishers() {
  const getPublishers = sql<IGetPublishersQuery>`
    SELECT
      *
    FROM
      public.publishers;
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
export const publishersTable = {
  getPublisherById,
  getAllPublisherNames,
  getAllPublishers,
  addPublisher,
  updatePublisher,
};
