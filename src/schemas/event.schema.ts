import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from './user.schema'
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export type EventDocument = Event & Document


export enum EventStatus {
    ACTIVE = 'Active',
    CANCELLED = 'Cancelled',
  }

  @ObjectType()

  @Schema({timestamps : true}) 

  export class Event {

    @Field()
    @Prop({required: true})
    title : string;

    @Field()
    @Prop() 
    description : string;

    @Field(() => ID)
    @Prop({type : Types.ObjectId, ref : 'User', required : true})
    organizerId : Types.ObjectId

    @Field(() => [ID], { nullable: true })
    @Prop({type : [Types.ObjectId]})
    participants : Types.ObjectId[]

    @Field(() => String)
    @Prop({required : true, enum : EventStatus, default : EventStatus.ACTIVE})
    status : EventStatus

    _id : Types.ObjectId

  }

  registerEnumType(EventStatus, { name: 'EventStatus' }); 

  export const EventSchema = SchemaFactory.createForClass(Event);





