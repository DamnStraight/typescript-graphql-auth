import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import Redis from 'ioredis';
import { createConnection } from 'typeorm';
import { refreshTokenHandler } from './auth';
import { createSchema } from './createSchema';
import headerValidation from './middleware/express/headerValidation';

require('dotenv-flow').config({
  path: 'src/.env/',
});

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const startServer = async (): Promise<void> => {
  console.log(`heh ${process.env.REDIS_HOST}`)
  const connection = await createConnection();

  if (connection) {
    await connection.runMigrations();
    // TODO Load fixtures when running from dev
  }

  const server = new ApolloServer({
    schema: await createSchema(),
    context: ({ req }: ExpressContextAuth) => ({
      req,
      isAuth: req.isAuth,
      currentUser: req.currentUser,
    }),
  });

  const app = express();

  app.use(headerValidation);
  app.post('/refresh_token', refreshTokenHandler);

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
