import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { name, surName, email, password } = createUserDto;

    const user = await this.userService.getUserByEmail(email);
    if (user) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await this.userService.createUser({
      name,
      surName,
      email,
      password: hashedPassword,
      friends: [],
    });

    return createdUser;
  }

  async login(email: string, password: string): Promise<object> {
    const payload = { email: email, sub: password };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
