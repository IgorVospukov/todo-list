import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('allusers')
  async allUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async findUser(@Req() req): Promise<User> {
    const email = req.user.email;
    return await this.userService.getUserByEmail(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friends')
  async getUserFriends(@Req() req): Promise<any[]> {
    const email = req.user.email;
    return await this.userService.getUserFriends(email);
  }

  @Post('create')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.userService.createUser(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('friend/:friendId/:friendEmail')
  async addFriendForUser(
    @Req() req,
    @Param('friendId') friendId: string,
    @Param('friendEmail') friendEmail: string,
  ): Promise<any> {
    const email = req.user.email;
    console.log('frends add mail', email);
    console.log('frends add friendId', friendId);
    return await this.userService.addFriendForUser(
      email,
      friendId,
      friendEmail,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }
}
