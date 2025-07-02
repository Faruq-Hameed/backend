import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitAssignmentDto {
  @IsNumber()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  file: string; // file URL or path
}
