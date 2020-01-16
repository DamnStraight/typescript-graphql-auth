import { createMethodDecorator } from 'type-graphql';
import { AnySchema } from '@hapi/joi';

/**
 * Runs arguments against provided Joi schema to be validated
 * 
 * @param schema Joi schema to run arguments against
 */
export function ValidateArgs(schema: AnySchema) {
  return createMethodDecorator(async ({ args }, next) => {
    await schema.validateAsync(args);
    return next();
  });
}
