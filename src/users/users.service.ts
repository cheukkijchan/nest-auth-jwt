import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

interface IUserCreate {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: IUserCreate): Promise<User> {
    // TODO: Check for duplicate
    return await this.usersRepository.save(data);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(condition: any): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username: condition } });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
