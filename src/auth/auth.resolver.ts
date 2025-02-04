import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { User } from '../schemas/user.schema';
import { LoginResponse } from './dto/login-response';


@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService, private userService: UserService) { }

    @Mutation(() => User)


    async register(@Args('registerInput') registerInput: RegisterInput) {

        return this.userService.create(registerInput)
    }

    @Mutation(() => LoginResponse)
    
    async login(
        @Args('loginInput') loginInput: LoginInput,
        @Context() context: any,
    ) : Promise<LoginResponse> {
        const user = await this.authService.validateUser(loginInput)
        const accessToken = await this.authService.login(user);
        return { user, accessToken};
    }
}






