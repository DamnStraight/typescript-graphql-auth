import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class RegistrationArgs {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}