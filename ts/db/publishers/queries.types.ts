/** Types generated for queries found in "ts/db/publishers/queries.ts" */

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

