import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**create a user service */
  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /*service to find a user */
  async findOne(data: Partial<User>, throwError = false) {
    const user = await this.userRepository.findOne({ where: { ...data } });
    //if this service should handle error if user not found
    if (!user && throwError) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
