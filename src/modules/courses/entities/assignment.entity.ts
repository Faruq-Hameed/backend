import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Course } from './course.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.assignments)
  student: User;

  @ManyToOne(() => Course, (course) => course.assignments)
  course: Course;

  @Column()
  file: string; // File path or cloud URL

  @Column({ type: 'int', nullable: true })
  grade: number;

  @CreateDateColumn()
  createdAt: Date;
}
