import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export type UserDocument = User & Document

export enum UserRole {
    ADMIN = 'Admin',
    ORGANIZER = 'Organizer',
    PARTICIPANT = 'Participant',
  }

  @ObjectType() 
  @Schema({timestamps : true})

  export class User {
    @Field() 
    @Prop({required : true})
    name : string;

    @Field()
    @Prop({required : true})
    email : string;

    @Field()
    @Prop({required : true})
    password : string

    @Field(() => UserRole)
    @Prop({required : true, enum : UserRole, default : UserRole.PARTICIPANT})
    role : UserRole

    _id : Types.ObjectId

}


registerEnumType(UserRole, { name: 'UserRole' }); 

export const UserSchema = SchemaFactory.createForClass(User)