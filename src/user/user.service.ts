import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { User, UserDocument } from '../schemas/user.schema';






@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserInput: CreateUserInput): Promise<UserDocument> {
        const { name, email, password, role } = createUserInput
        const hashedPassword = await bcrypt.hash(password, 10)
        const existingUser = await this.userModel.findOne({email}).exec()
        if (existingUser) {
            throw new UnauthorizedException('User already exists')
        }
        const user = new this.userModel({ name, email, password: hashedPassword, role })
        return user.save()
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec()
    }
    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec()
    }
}
