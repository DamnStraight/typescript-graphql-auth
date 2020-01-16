import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { AuthResolver } from './modules/auth/auth.resolver';
import { customAuthChecker } from './middleware/graphql/customAuthChecker';

useContainer(Container);

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [AuthResolver],
    container: Container,
    authChecker: customAuthChecker
  })
};