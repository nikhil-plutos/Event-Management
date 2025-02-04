import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/schemas/user.schema';


@InputType()

export class RegisterInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => UserRole, { defaultValue: UserRole.PARTICIPANT })
  @IsEnum(UserRole)
  role: UserRole
}