import {  IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/utils/userRole";

export class CreateUserDto {
  
    @IsNotEmpty({message: 'email is required'})
    @IsEmail()
    email: string;
  
    @IsNotEmpty({message: 'password is required'})
    @IsString()
    password: string;
  
    @IsEnum(UserRole, { message: 'role must be a valid UserRole' })
    role: UserRole = UserRole.STUDENT;
  }
  
