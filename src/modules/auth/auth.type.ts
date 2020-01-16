import { Field, ObjectType } from 'type-graphql';
import { User } from '../../entity/User';

@ObjectType({ description: 'User object' })
export default class LoginResponse {
  constructor(user: User, accessToken: string, refreshToken: string, expiration: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiration = expiration;
  }

  @Field()
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiration: string;
}
