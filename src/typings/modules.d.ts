import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Request } from 'express';
import { AuthenticatedUser } from './app';
import Pino from 'pino';

declare global {
  namespace Express {
    interface Request {
      isAuth: boolean;
      currentUser?: AuthenticatedUser;
    }
  }

  interface ExpressContextAuth extends ExpressContext {
    req: Request;
  }

  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_USER: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
      LOG_LEVEL: Pino.LevelWithSilent;
    }
  }
}
