import { createParamDecorator } from "type-graphql";
import { AppContext } from "../../typings/app";

/**
 * Utility decorator for resolver functions, extracts authentication objext from the Graphql
 * context
 */
export default function CurrentUser()  {
  return createParamDecorator<AppContext>(({ context }) => context.currentUser);
}