import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { LoginUserDto } from './user/dto/login-user.dto';

@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('validate')
  async validate(@Body() validateDto: LoginUserDto) {
    return this.authService.validateUser(
      validateDto.email,
      validateDto.password,
    );
  }
}
