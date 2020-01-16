import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { User } from '../../entity/User';
import { ValidateArgs } from '../../middleware/graphql/ValidateArgs';
import AuthService from '../../service/auth.service';
import { AuthenticatedUser } from '../../typings/app';
import CurrentUser from '../../util/decorators/CurrentUser';
import { RegistrationArgs } from './auth.args';
import { RegistrationSchema } from './auth.schema';
import LoginResponse from './auth.type';

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly authService: AuthService;

  @Query(() => Boolean)
  async me() {
    return true;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  /**
   * Log in user using given credentials
   */
  async login(
    @Arg('emailOrUsername') emailOrUsername: string,
    @Arg('password') password: string
  ): Promise<LoginResponse | undefined> {
    return await this.authService.login(emailOrUsername, password);
  }

  @Mutation(() => User)
  @ValidateArgs(RegistrationSchema)
  /**
   * Register and create new user
   */
  async register(@Args() registrationData: RegistrationArgs) {
    return await this.authService.register(registrationData);
  }

  @Mutation(() => Boolean, { nullable: true })
  /**
   * Logout user - places users refresh token inside redis blacklist
   */
  async logout(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Arg('refreshToken') refreshToken: string
  ) {
    return await this.authService.logout(currentUser, refreshToken);
  }
}
