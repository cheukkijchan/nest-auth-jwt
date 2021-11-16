import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

interface UserInfo extends Omit<User, 'password'> {}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserInfo> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new BadRequestException('Invalid crendentials');
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new BadRequestException('Invalid crendentials');
    }

    delete user.password;

    return user;
  }

  // stateless header approach
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
