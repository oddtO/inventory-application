/** Types generated for queries found in "ts/db/queries.ts" */

/** 'QueryTable' parameters type */
export type IQueryTableParams = void;

/** 'QueryTable' return type */
export interface IQueryTableResult {
  data: Buffer | null;
}

/** 'QueryTable' query type */
export interface IQueryTableQuery {
  params: IQueryTableParams;
  result: IQueryTableResult;
}

/** 'AddImg' parameters type */
export interface IAddImgParams {
  data?: Buffer | null | void;
}

/** 'AddImg' return type */
export type IAddImgResult = void;

/** 'AddImg' query type */
export interface IAddImgQuery {
  params: IAddImgParams;
  result: IAddImgResult;
}

