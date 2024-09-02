import { sql } from "@pgtyped/runtime";
import { pool } from "../pool";
import {
  IAddPublisherQuery,
  IGetPublisherNamesQuery,
  IGetPublishersQuery,
} from "./queries.types";

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

export const publishersTable = {
  getAllPublisherNames,
  getAllPublishers,
  addPublisher,
};
