import { body, Meta } from "express-validator";
import { db } from "../db/queries";

export function getNameValidation() {
  const maxNameLength = 20;
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: maxNameLength })
      .withMessage(`Max name length is ${maxNameLength}`),
  ];
}

async function uniqueName(
  value: string[],
  meta: Meta,
  checkNameUniqueCb: (name: string, id?: string) => Promise<boolean>,
) {
  const params = meta.req.params as { id?: string };
  const isTaken = await checkNameUniqueCb(value[0], params.id);
  return isTaken;
}
export function uniqueGameName() {
  return [
    body("name")
      .trim()
      .custom(async (value: string[], meta: Meta) => {
        const isTaken = await uniqueName(
          value,
          meta,
          db.checkIfGameNameIsAlreadyTaken,
        );
        if (isTaken) {
          return Promise.reject();
        }

        return true;
      })
      .withMessage("Name must be unique"),
  ];
}
export function uniquePublisherName() {
  return [
    body("name")
      .trim()
      .custom(async (value: string[], meta: Meta) => {
        const isTaken = await uniqueName(
          value,
          meta,
          db.checkIfPublisherNameIsAlreadyTaken,
        );
        if (isTaken) {
          return Promise.reject();
        }

        return true;
      })
      .withMessage("Name must be unique"),
  ];
}

export function uniqueGenreName() {
  return [
    body("name")
      .trim()
      .custom(async (value: string[], meta: Meta) => {
        const isTaken = await uniqueName(
          value,
          meta,
          db.checkIfGenreNameIsAlreadyTaken,
        );
        if (isTaken) {
          return Promise.reject();
        }

        return true;
      })
      .withMessage("Name must be unique"),
  ];
}
export function getGameFormValidators() {
  return [
    ...getNameValidation(),
    body("publisher")
      .trim()
      .notEmpty()
      .custom(async (value: string[], { req }) => {
        const publishers = await db.getAllPublisherNames();
        const publisher = publishers.find(
          (publisher) => +publisher.id == +value[0],
        );

        if (!publisher) {
          throw new Error("Publisher added absent in the database");
        }

        return true;
      })
      .withMessage("Publisher is required"),
    body("genres")
      .isLength({ min: 1 })
      .withMessage("at least one checkbox must be checked")
      .custom(async (value: string[] | null, { req }) => {
        if (!value) return true;
        const genres = await db.getAllGenreNames();

        for (const insertedGenreId of value) {
          const genre = genres.find((genre) => {
            return genre.id === insertedGenreId;
          });

          if (!genre) {
            throw new Error("Illegal genre given");
          }
        }

        return true;
      })
      .withMessage("Genre absent in the database was given"),
  ];
}
