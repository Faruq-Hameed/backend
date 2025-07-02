//(For admin approval)
import { IsIn, IsNumber } from 'class-validator';

export class UpdateEnrollmentStatusDto {
  @IsNumber()
  enrollmentId: number;

  @IsIn(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';
}
