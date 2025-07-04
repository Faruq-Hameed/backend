//(For admin approval)
import { IsIn, IsNumber } from 'class-validator';

export class UpdateEnrollmentStatusDto {
  @IsNumber()
  enrollmentId: number;

  @IsIn([ 'approved', 'rejected'])
  status:  'approved' | 'rejected';
}
