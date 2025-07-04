import { IsNumber } from 'class-validator';

export class EnrollCourseDto {
  @IsNumber()
  courseId: number;

  @IsNumber()
  studentId: number;
}
