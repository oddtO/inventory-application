/** Types generated for queries found in "ts/db/games/queries.ts" */
export type NumberOrString = number | string;

/** 'GetAllGames' parameters type */
export type IGetAllGamesParams = void;

/** 'GetAllGames' return type */
export interface IGetAllGamesResult {
  game_name: string;
  genres: string | null;
  id: string;
  image: Buffer;
  mime_type: string;
  publisher_name: string;
}

/** 'GetAllGames' query type */
export interface IGetAllGamesQuery {
  params: IGetAllGamesParams;
  result: IGetAllGamesResult;
}

/** 'AddGame' parameters type */
export interface IAddGameParams {
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
  publisher_id?: NumberOrString | null | void;
}

/** 'AddGame' return type */
export interface IAddGameResult {
  id: string;
}

/** 'AddGame' query type */
export interface IAddGameQuery {
  params: IAddGameParams;
  result: IAddGameResult;
}

/** 'AssignGenresToGame' parameters type */
export interface IAssignGenresToGameParams {
  genreData: readonly ({
    insertedGameId: NumberOrString | null | void,
    genreId: NumberOrString | null | void
  })[];
}

/** 'AssignGenresToGame' return type */
export type IAssignGenresToGameResult = void;

/** 'AssignGenresToGame' query type */
export interface IAssignGenresToGameQuery {
  params: IAssignGenresToGameParams;
  result: IAssignGenresToGameResult;
}

