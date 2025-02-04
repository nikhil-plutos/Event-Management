import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventInput } from './dto/create-event.input';
import { Event } from 'src/schemas/event.schema';
import { UserRole } from 'src/schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { EventStatus } from 'src/schemas/event.schema';
import { User } from 'src/schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';




@Resolver()
export class EventResolver {
    constructor(private readonly eventService: EventService) { }

    @Mutation(() => Event)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ORGANIZER)
    async createEvent(@Args('createEventInput') createEventInput: CreateEventInput,
        @Context() context: any,
    ): Promise<Event> {
        console.log("Context Request User:", context.req?.user);
        const user = context?.req?.user

        const eventData = {
            ...createEventInput,
            organizerId: user.id
        };
        return this.eventService.create(eventData, user);
    }

    @Mutation(() => Event)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
    async cancelEvent(@Args('eventId') eventId: string, context: any): Promise<Event | null> {
        const user = context.req.user
        const event = await this.eventService.findById(eventId)

        if (!event) {
            throw new UnauthorizedException('Event not found')

        }



        return this.eventService.updateEventStatus(eventId, EventStatus.CANCELLED);
    }

    @Mutation(() => Event)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.PARTICIPANT)
    async registerParticipant(
        @Args('eventId') eventId: string,
       
        @Context() context: any
    ): Promise<Event | null> {
        console.log("Context Request User:", context.req?.user);
        const user = context?.req?.user

        return this.eventService.registerParticipant(eventId, user._id);

    }






    @Query(() => [Event])
    async getEventByStatus(
        @Args('status') status: EventStatus): Promise<Event[]> {
        return this.eventService.findByStatus(status)
    }

    @Query(() => [Event])
    async getEventsByParticipant(@Args('userId') userId: string): Promise<Event[]> {
        return this.eventService.findByParticipant(userId);
    }

    @Query(() => [User])
    async getEventParticipants(@Args('eventId') eventId: string): Promise<User[]> {
        return this.eventService.getParticipants(eventId);
    }



}
