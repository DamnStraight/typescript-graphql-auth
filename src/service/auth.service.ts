import { ApolloError } from 'apollo-server-core';
import * as bcrypt from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import { Authorized } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { createAccessToken, createRefreshToken, TokenDto } from '../auth';
import { User } from '../entity/User';
import { redis } from '../index';
import { RegistrationArgs } from '../modules/auth/auth.args';
import LoginResponse from '../modules/auth/auth.type';
import { UserRepository } from '../repository/user.repository';
import { AuthenticatedUser } from '../typings/app';
import { InjectLogger } from '../util/decorators/InjectLogger';
import { LabeledLogger } from '../util/logging/LabeledLogger';

@Service()
export default class AuthService {
  @InjectRepository(User)
  private readonly userRepo: UserRepository;

  @InjectLogger('service:auth')
  private readonly logger: LabeledLogger;

  /**
   * Create and return a JWT token upon successful credential validation
   */
  async login(emailOrUsername: string, password: string) {
    this.logger.info('login', 'attempted login', emailOrUsername, password);

    // Fetch the user from the DB with matching credentials
    const user = await this.userRepo.findOneByEmailOrUsername(emailOrUsername);

    // If the credentials didn't return a result, no user with that email/username exists
    if (!user) {
      throw new ApolloError(
        'Failed to authenticate - Incorrect username or password',
        'AUTHENTICATION_FAILED'
      );
    }

    // Check that the password matches the user's stored encrypted password
    const isValid = await bcrypt.compare(password, user.password);

    // Passwords don't match
    if (!isValid) {
      throw new ApolloError(
        'Failed to authenticate - Incorrect username or password',
        'AUTHENTICATION_FAILED'
      );
    }

    // Extract the relevant details to be stored into the JWT
    const tokenDto = user.toTokenDto();

    return new LoginResponse(
      user,
      createAccessToken(tokenDto),
      createRefreshToken(tokenDto),
      '15min'
    );
  }

  /**
   * Register a new user if a duplicate is not found
   */
  async register(registrationData: RegistrationArgs) {
    this.logger.info('register', 'attempted', registrationData);

    const { email, username, password } = registrationData;

    // Check that the email/username does not currently exist
    if (await this.userRepo.exists({ email, username })) {
      this.logger.error('register', 'registration failed due to duplicate login details');
      throw new ApolloError('Duplicate username or email', 'REGISTRATION_FAILED');
    }

    // Save the user and return the result
    return await await this.userRepo.save(new User({ email, username, password }));
  }

  @Authorized(['USER', 'ADMIN'])
  /**
   * Add users refresh token to blacklist
   */
  async logout(currentUser: AuthenticatedUser, refreshToken: string) {
    try {
      // Check that the refresh token is valid
      const decodedToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as TokenDto;

      this.logger.info('logout', 'blacklisting refresh token', decodedToken, refreshToken);

      // Store the token in the redis blacklist
      await redis.set(String(currentUser.id), refreshToken, 'EX', 100);
    } catch (err) {
      // Expired token
      return false;
    }

    return true;
  }
}
