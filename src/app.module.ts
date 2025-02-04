import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigModule} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {GraphQLModule} from '@nestjs/graphql';
import { EventModule } from './event/event.module';
import { Connection } from 'mongoose';
import { RolesGuard } from './auth/roles.guard';  
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard';
import { JwtModule} from '@nestjs/jwt';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true, 
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    AuthModule,
    EventModule,
    ],
  controllers: [AppController],
  providers: [AppService,
    
    
  ],
})



export class AppModule {}