import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service'; // Adjust the import path as needed
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { IUserJwtPayload } from './interfaces/user.jwt.payload';
import { IPublicUser } from './interfaces/public.user.interface';
import { AuthReturn } from './interfaces/authReturn';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**Auth service to create a user. It checks for conflicting user and also handles password hashing */
  async register(createUserDto: CreateUserDto): Promise<AuthReturn> {
    const existingUser = await this.userService.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const { password, ...user } =
      await this.userService.createUser(createUserDto);

    return { user, token: await this.generateToken(user) };
  }

  async login(loginDto: LoginDto): Promise<AuthReturn> {
    const { password, ...user } = await this.userService.findOne(
      { email: loginDto.email },
      true,
    );
    const isPasswordValid = await bcrypt.compare(loginDto.password, password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }
    return {
      user,
      token: await this.generateToken(user),
    };
  }

  async generateToken(user: IPublicUser): Promise<string> {
    return this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });
  }
}
