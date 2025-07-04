import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserRole } from 'src/utils/userRole';
import { Course } from 'src/modules/courses/entities/course.entity';
import { Enrollment } from 'src/modules/courses/entities/enrollment.entity';
import { Assignment } from 'src/modules/courses/entities/assignment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //relationships
  @OneToMany(() => Course, (course) => course.lecturer)
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.student)
  assignments: Assignment[];
}
