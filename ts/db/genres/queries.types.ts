/** Types generated for queries found in "ts/db/genres/queries.ts" */
export type NumberOrString = number | string;

/** 'ConvertGenreIdToName' parameters type */
export interface IConvertGenreIdToNameParams {
  id?: NumberOrString | null | void;
}

/** 'ConvertGenreIdToName' return type */
export interface IConvertGenreIdToNameResult {
  name: string;
}

/** 'ConvertGenreIdToName' query type */
export interface IConvertGenreIdToNameQuery {
  params: IConvertGenreIdToNameParams;
  result: IConvertGenreIdToNameResult;
}

/** 'SearchGenres' parameters type */
export interface ISearchGenresParams {
  query?: string | null | void;
}

/** 'SearchGenres' return type */
export interface ISearchGenresResult {
  id: string;
  image: Buffer;
  mime_type: string;
  name: string;
}

/** 'SearchGenres' query type */
export interface ISearchGenresQuery {
  params: ISearchGenresParams;
  result: ISearchGenresResult;
}

/** 'CountGenres' parameters type */
export type ICountGenresParams = void;

/** 'CountGenres' return type */
export interface ICountGenresResult {
  count: string | null;
}

/** 'CountGenres' query type */
export interface ICountGenresQuery {
  params: ICountGenresParams;
  result: ICountGenresResult;
}

/** 'GetGenreById' parameters type */
export interface IGetGenreByIdParams {
  id?: NumberOrString | null | void;
}

/** 'GetGenreById' return type */
export interface IGetGenreByIdResult {
  id: string;
  image: Buffer;
  mime_type: string;
  name: string;
}

/** 'GetGenreById' query type */
export interface IGetGenreByIdQuery {
  params: IGetGenreByIdParams;
  result: IGetGenreByIdResult;
}

/** 'GetAllGenreNames' parameters type */
export type IGetAllGenreNamesParams = void;

/** 'GetAllGenreNames' return type */
export interface IGetAllGenreNamesResult {
  id: string;
  name: string;
}

/** 'GetAllGenreNames' query type */
export interface IGetAllGenreNamesQuery {
  params: IGetAllGenreNamesParams;
  result: IGetAllGenreNamesResult;
}

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

/** 'ChangeGenreNameOnly' parameters type */
export interface IChangeGenreNameOnlyParams {
  id?: NumberOrString | null | void;
  name?: string | null | void;
}

/** 'ChangeGenreNameOnly' return type */
export type IChangeGenreNameOnlyResult = void;

/** 'ChangeGenreNameOnly' query type */
export interface IChangeGenreNameOnlyQuery {
  params: IChangeGenreNameOnlyParams;
  result: IChangeGenreNameOnlyResult;
}

/** 'ChangeGenreNameAndImg' parameters type */
export interface IChangeGenreNameAndImgParams {
  id?: NumberOrString | null | void;
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
}

/** 'ChangeGenreNameAndImg' return type */
export type IChangeGenreNameAndImgResult = void;

/** 'ChangeGenreNameAndImg' query type */
export interface IChangeGenreNameAndImgQuery {
  params: IChangeGenreNameAndImgParams;
  result: IChangeGenreNameAndImgResult;
}

/** 'DeleteGenreById' parameters type */
export interface IDeleteGenreByIdParams {
  id?: NumberOrString | null | void;
}

/** 'DeleteGenreById' return type */
export type IDeleteGenreByIdResult = void;

/** 'DeleteGenreById' query type */
export interface IDeleteGenreByIdQuery {
  params: IDeleteGenreByIdParams;
  result: IDeleteGenreByIdResult;
}

