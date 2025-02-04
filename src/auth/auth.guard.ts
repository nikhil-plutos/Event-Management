import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {} 

 async canActivate(context: ExecutionContext):  Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);  
    const ctx = gqlContext.getContext();

    console.log("Request:", ctx)
    const token = this.extractTokenFromHeader(ctx.req); 

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token);  

      console.log("paylooooooooooadddddd", payload)
      const user = await this.userModel.findById(payload.id)

      if (!user) {
        throw new UnauthorizedException(); 
    }

      ctx.req.user = user; 
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }
}