import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventInput } from './dto/create-event.input';
import { Event,EventDocument } from 'src/schemas/event.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema'
import { EventStatus } from 'src/schemas/event.schema';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @InjectModel(User.name) private userModel: Model<User>
    ) {}
    async create(createEventInput: CreateEventInput, user: User): Promise<Event> {
       
        const event = new this.eventModel({
            ...createEventInput,
            organizerId: user._id,
        })
        return event.save()
    }

    async findById(eventId: string): Promise<Event | null> {
        return this.eventModel.findById(eventId).exec()
    }

    async findOne(filter: any): Promise<Event | null> {
        return this.eventModel.findOne(filter).exec();
    }



    async updateEventStatus(eventId: string, status: EventStatus): Promise<Event | null> {
        return this.eventModel.findByIdAndUpdate(eventId, { status }, { new: true });
    }
    async registerParticipant(eventId: string, user : User): Promise<Event | null> {
        console.log(`Adding user ${user._id} to event ${eventId}`);
        return this.eventModel.findByIdAndUpdate(eventId, { $addToSet: { participants: user._id } }, { new: true }).exec()
    }

    async findByStatus(status: string): Promise<Event[]> {
        return this.eventModel.find({ status }).exec()
    }
    async getParticipants(eventId: string): Promise<User[]> {
        const event = await this.eventModel.findById(eventId)
        .exec();
        if (!event) {
            throw new Error('Event not found');
        }
        return this.userModel.find({ _id: { $in: event.participants } }).select('name email').exec();
       
    }
    async findByParticipant(userId: string): Promise<Event[]> {
        return this.eventModel.find({ participants: userId }).exec();
      }
    
}
