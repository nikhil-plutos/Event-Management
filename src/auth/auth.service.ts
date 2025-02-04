import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserService} from '../user/user.service'
import { LoginInput } from './dto/login.input';
import { User } from 'src/schemas/user.schema';



@Injectable()
export class AuthService {
    constructor(private userService : UserService, private jwtService : JwtService){}

    async validateUser(loginInput: LoginInput): Promise<User> {
      const user = await this.userService.findByEmail(loginInput.email); 
      if (!user || !(await bcrypt.compare(loginInput.password, user.password))) { 
        throw new UnauthorizedException('Invalid credentials');
      }
      return user; 
    }
  
    
    async login(user: User): Promise< string > {

      const payload = { id: user._id, role: user.role }; 
      const accessToken = this.jwtService.sign(payload); 
      return  accessToken ; 
    }
}
