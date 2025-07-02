import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { IPublicUser } from './interfaces/public.user.interface';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Public } from 'src/common/guards/public.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  @SuccessMessage('User registered successfully')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @SuccessMessage('Login successful. Token generated')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
