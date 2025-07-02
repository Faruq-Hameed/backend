import {  IsEmail,  IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  
    @IsNotEmpty({message: 'email is required'})
    @IsEmail()
    email: string;
  
    @IsNotEmpty({message: 'password is required'})
    @IsString()
    password: string;
  
  }
  
