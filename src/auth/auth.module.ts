import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module'; 
import { RolesGuard } from './roles.guard';
import { AuthGuard } from './auth.guard'; 

@Module({
  imports: [
    
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, 
      }),
    }),
    UserModule, 
  ],
  providers: [
    AuthService,
    AuthResolver,
    AuthGuard,
    RolesGuard,
  ],
  exports: [AuthService,AuthGuard, RolesGuard, JwtModule], 
})
export class AuthModule {}

