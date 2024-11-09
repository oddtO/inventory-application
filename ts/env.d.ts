declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PGURI: string;
      DELETE_ALLOW_PASSWORD: string;
    }
  }
}

export {}
