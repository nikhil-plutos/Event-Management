import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/schemas/user.schema'; 

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}
