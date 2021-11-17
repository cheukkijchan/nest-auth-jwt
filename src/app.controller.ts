import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;
    return user;
  }

  // LocalAuthGuard> localstrategy.validate> authService.validateUser, return user
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // using the return from guard, login using authservice, in which return access_token
    const token = await this.authService.login(req.user);

    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      domain: process.env.DOMAIN || 'localhost',
      maxAge: 1 * 60 * 1000, // 1 minutes
    });
    return { message: 'login success' };
  }

  @Post('auth/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return { message: 'logout success' };
  }

  // Protected route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
