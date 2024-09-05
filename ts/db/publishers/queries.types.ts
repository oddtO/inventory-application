/** Types generated for queries found in "ts/db/publishers/queries.ts" */
export type NumberOrString = number | string;

/** 'GetPublisherById' parameters type */
export interface IGetPublisherByIdParams {
  id?: NumberOrString | null | void;
}

/** 'GetPublisherById' return type */
export interface IGetPublisherByIdResult {
  id: string;
  image: Buffer;
  mime_type: string;
  name: string;
}

/** 'GetPublisherById' query type */
export interface IGetPublisherByIdQuery {
  params: IGetPublisherByIdParams;
  result: IGetPublisherByIdResult;
}

/** 'GetPublisherNames' parameters type */
export type IGetPublisherNamesParams = void;

/** 'GetPublisherNames' return type */
export interface IGetPublisherNamesResult {
  id: string;
  name: string;
}

/** 'GetPublisherNames' query type */
export interface IGetPublisherNamesQuery {
  params: IGetPublisherNamesParams;
  result: IGetPublisherNamesResult;
}

/** 'GetPublishers' parameters type */
export type IGetPublishersParams = void;

/** 'GetPublishers' return type */
export interface IGetPublishersResult {
  id: string;
  image: Buffer;
  mime_type: string;
  name: string;
}

/** 'GetPublishers' query type */
export interface IGetPublishersQuery {
  params: IGetPublishersParams;
  result: IGetPublishersResult;
}

/** 'AddPublisher' parameters type */
export interface IAddPublisherParams {
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
}

/** 'AddPublisher' return type */
export type IAddPublisherResult = void;

/** 'AddPublisher' query type */
export interface IAddPublisherQuery {
  params: IAddPublisherParams;
  result: IAddPublisherResult;
}

/** 'ChangePublisherNameOnly' parameters type */
export interface IChangePublisherNameOnlyParams {
  id?: NumberOrString | null | void;
  name?: string | null | void;
}

/** 'ChangePublisherNameOnly' return type */
export type IChangePublisherNameOnlyResult = void;

/** 'ChangePublisherNameOnly' query type */
export interface IChangePublisherNameOnlyQuery {
  params: IChangePublisherNameOnlyParams;
  result: IChangePublisherNameOnlyResult;
}

/** 'ChangePublisherNameAndImg' parameters type */
export interface IChangePublisherNameAndImgParams {
  id?: NumberOrString | null | void;
  image?: Buffer | null | void;
  mime_type?: string | null | void;
  name?: string | null | void;
}

/** 'ChangePublisherNameAndImg' return type */
export type IChangePublisherNameAndImgResult = void;

/** 'ChangePublisherNameAndImg' query type */
export interface IChangePublisherNameAndImgQuery {
  params: IChangePublisherNameAndImgParams;
  result: IChangePublisherNameAndImgResult;
}

/** 'DeletePublisherById' parameters type */
export interface IDeletePublisherByIdParams {
  id?: NumberOrString | null | void;
}

/** 'DeletePublisherById' return type */
export type IDeletePublisherByIdResult = void;

/** 'DeletePublisherById' query type */
export interface IDeletePublisherByIdQuery {
  params: IDeletePublisherByIdParams;
  result: IDeletePublisherByIdResult;
}

