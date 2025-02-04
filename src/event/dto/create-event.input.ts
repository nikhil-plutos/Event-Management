import { InputType, Field } from '@nestjs/graphql';


@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;


  @Field(() => [String], { nullable: true })
  participants?: string[];  

  @Field(() => String, { defaultValue: 'Active' })
  status: string;  
}

