import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async findOneUser(_id: string): Promise<User> {
    return await this.model.findOne({ _id }).exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.model.findOne({ email }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await new this.model({
      ...createUserDto,
      createdAt: new Date(),
    }).save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async deleteUser(id: string): Promise<User> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async addFriendForUser(
    email: string,
    friendId: string,
    friendEmail: string,
  ): Promise<User> {
    const user = await this.model.findOne({ email }).exec();
    const friend = await this.model.findById(friendId).exec();
    if (!user.friends) {
      user.friends = [];
    }
    user.friends.push({ id: friend.id, email: friendEmail });
    return await user.save();
  }

  async getUserFriends(email: string): Promise<any[]> {
    const user = await this.model.findOne({ email }).exec();
    if (!user.friends) {
      user.friends = [{ id: null, email: null }];
    }
    const friendIds = user.friends.map((friend) => friend.id);
    const friends = await this.model.find({ _id: { $in: friendIds } }).exec();
    return friends.map((friend) => ({
      id: friend.id,
      email: email,
    }));
  }
}
