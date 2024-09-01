/** Types generated for queries found in "ts/db/genres/queries.ts" */

/** 'GetAllGenres' parameters type */
export type IGetAllGenresParams = void;

/** 'GetAllGenres' return type */
export interface IGetAllGenresResult {
  id: string;
  image: Buffer;
  mime_type: string;
  name: string;
}

/** 'GetAllGenres' query type */
export interface IGetAllGenresQuery {
  params: IGetAllGenresParams;
  result: IGetAllGenresResult;
}

/** 'AddGenre' parameters type */
export interface IAddGenreParams {
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
}

/** 'AddGenre' return type */
export type IAddGenreResult = void;

/** 'AddGenre' query type */
export interface IAddGenreQuery {
  params: IAddGenreParams;
  result: IAddGenreResult;
}

