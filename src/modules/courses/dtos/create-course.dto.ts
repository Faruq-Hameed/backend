import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  credits: number;

  @IsOptional()
  @IsString()
  syllabus?: string; // Optional field
}
