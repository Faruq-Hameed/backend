import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
// import { User } from '../user/entities/user.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    // @InjectRepository(User)
    // private readonly userRepo: Repository<User>,
  ) {}

  // Create a new course (lecturer)
  async createCourse(lecturerId: number, dto: CreateCourseDto) {
    const existingTitle = await this.getCourseByTitle(dto.title);
    if (existingTitle) {
      throw new ConflictException('Course title already exists');
    }
    const course = this.courseRepo.create({
      ...dto,
      lecturer: { id: lecturerId },
    });

    return this.courseRepo.save(course);
  }

  // Update course details
  async updateCourse(
    courseId: number,
    lecturerId: number,
    dto: UpdateCourseDto,
  ) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['lecturer'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.lecturer.id !== lecturerId) {
      throw new BadRequestException('You can only update your own courses');
    }

    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  // Get all courses
  async getAllCourses() {
    return this.courseRepo.find({
      relations: ['lecturer'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get course by ID
  async getCourseById(courseId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['lecturer'],
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async getCourseByTitle(title: string) {
    return await this.courseRepo.findOne({
      where: { title },
      relations: ['lecturer'],
    });
  }

  // Optional: Delete a course
  async deleteCourse(courseId: number, lecturerId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['lecturer'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.lecturer.id !== lecturerId) {
      throw new BadRequestException('You can only delete your own courses');
    }

    return this.courseRepo.remove(course);
  }




}
