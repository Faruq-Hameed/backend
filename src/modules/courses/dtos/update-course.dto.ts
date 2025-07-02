import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  credits?: number;

  @IsOptional()
  @IsString()
  syllabus?: string;
}
