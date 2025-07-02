import { IsNumber, Min, Max } from 'class-validator';

export class GradeAssignmentDto {
  @IsNumber()
  assignmentId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  grade: number;
}
