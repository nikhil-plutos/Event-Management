import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/schemas/event.schema';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
      
      MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      UserModule,
      AuthModule
    ],
  providers: [EventService, EventResolver],
   exports: [EventService], 
})
export class EventModule {}
