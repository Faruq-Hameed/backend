import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Index(['student', 'course'], { unique: true }) // prevent duplicate enrollments and faster lookup
@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;

  @ManyToOne(() => User, { nullable: true })
  rejectedBy: User;

  @Column( { nullable: true })
  approvedAt: Date

  @Column( { nullable: true })
  rejectedAt: Date

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
