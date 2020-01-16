import { Logger } from 'pino';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { AppContext } from '../../typings/app';
import { InjectLogger } from '../../util/decorators/InjectLogger';

export class LogAccess implements MiddlewareInterface<AppContext> {
  @InjectLogger()
  private readonly logger: Logger;

  async use({ context, info }: ResolverData<AppContext>, next: NextFn) {
    this.logger.info(`${context.req.ip} - ${info}`);

    return next();
  }
}
