import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Enrollment } from './enrollement.entity';
import { Assignment } from './assignment.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  credits: number;

  @Column({ nullable: true })
  syllabus: string; // This can be a URL or generated text

  @ManyToOne(() => User, (user) => user.courses)
  lecturer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //relationship
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];
}
