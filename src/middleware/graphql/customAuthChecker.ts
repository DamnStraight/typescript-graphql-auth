import { AuthChecker } from 'type-graphql';
import { AppContext } from '../../typings/app';

export const customAuthChecker: AuthChecker<AppContext> = ({ context }, roles) =>
  roles.includes(context.currentUser.role);
