declare namespace NodeJS {
  export interface ProcessEnv {
    PGUSER: string;
    PGHOST: string;
    PGDATABASE: string;
    PGPASSWORD: string;
    PGPORT: string;
    PGURI: string;
    PORT?: string;
    DELETE_ALLOW_PASSWORD: string;
  }
}
