declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      JWT_SECRET?: string;
      PUBLIC_URL?: string;
    }
  }
}

export {};