import { body } from "express-validator";
import { db } from "../db/queries";
export function getNameValidation() {
  return [body("name").trim().notEmpty().withMessage("Name is required")];
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
