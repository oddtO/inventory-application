/** Types generated for queries found in "ts/db/games/queries.ts" */
export type NumberOrString = number | string;

export type stringArray = (string)[];

/** 'GetGameById' parameters type */
export interface IGetGameByIdParams {
  id?: NumberOrString | null | void;
}

/** 'GetGameById' return type */
export interface IGetGameByIdResult {
  genreids: stringArray | null;
  genrenames: string | null;
  id: string;
  name: string;
  publisher_id: string;
}

/** 'GetGameById' query type */
export interface IGetGameByIdQuery {
  params: IGetGameByIdParams;
  result: IGetGameByIdResult;
}

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

/** 'UpdateGameButLeaveImg' parameters type */
export interface IUpdateGameButLeaveImgParams {
  id?: NumberOrString | null | void;
  name?: string | null | void;
  publisher_id?: NumberOrString | null | void;
}

/** 'UpdateGameButLeaveImg' return type */
export type IUpdateGameButLeaveImgResult = void;

/** 'UpdateGameButLeaveImg' query type */
export interface IUpdateGameButLeaveImgQuery {
  params: IUpdateGameButLeaveImgParams;
  result: IUpdateGameButLeaveImgResult;
}

/** 'UpdateGameAndImg' parameters type */
export interface IUpdateGameAndImgParams {
  id?: NumberOrString | null | void;
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
  publisher_id?: NumberOrString | null | void;
}

/** 'UpdateGameAndImg' return type */
export type IUpdateGameAndImgResult = void;

/** 'UpdateGameAndImg' query type */
export interface IUpdateGameAndImgQuery {
  params: IUpdateGameAndImgParams;
  result: IUpdateGameAndImgResult;
}

/** 'DeleteGenresFromGame' parameters type */
export interface IDeleteGenresFromGameParams {
  id?: NumberOrString | null | void;
}

/** 'DeleteGenresFromGame' return type */
export type IDeleteGenresFromGameResult = void;

/** 'DeleteGenresFromGame' query type */
export interface IDeleteGenresFromGameQuery {
  params: IDeleteGenresFromGameParams;
  result: IDeleteGenresFromGameResult;
}

/** 'ReassignGenresToGame' parameters type */
export interface IReassignGenresToGameParams {
  genreIds: readonly ({
    insertedGameId: NumberOrString | null | void,
    genreId: NumberOrString | null | void
  })[];
}

/** 'ReassignGenresToGame' return type */
export type IReassignGenresToGameResult = void;

/** 'ReassignGenresToGame' query type */
export interface IReassignGenresToGameQuery {
  params: IReassignGenresToGameParams;
  result: IReassignGenresToGameResult;
}

/** 'DeleteGameById' parameters type */
export interface IDeleteGameByIdParams {
  id?: NumberOrString | null | void;
}

/** 'DeleteGameById' return type */
export type IDeleteGameByIdResult = void;

/** 'DeleteGameById' query type */
export interface IDeleteGameByIdQuery {
  params: IDeleteGameByIdParams;
  result: IDeleteGameByIdResult;
}

