import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollCourseDto } from './dtos/enroll-course.dto';
import { CourseService } from '../courses/courses.service';
import { ConflictException } from '@nestjs/common';

export class EnrollmentService {
  constructor(
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly courseService: CourseService,
  ) {}
  async createEnrollment(
    enrollCourseDto: EnrollCourseDto,
  ): Promise<Enrollment> {
    const { studentId, courseId } = enrollCourseDto;
    //check if student is already enrolled ad if course exist
    const [enrollment] = await Promise.all([
      this.enrollmentRepository.findOne({
        where: {
          course: { id: courseId },
          student: { id: studentId },
        },
      }),
      this.courseService.getCourseById(courseId),
    ]);
    if (enrollment) {
      throw new ConflictException(
        'Student is already enrolled. If not approved kindly contact the admin',
      );
    }
    //create enrollment
    return this.enrollmentRepository.save({
      //I didn't use await here because it's a promise and it's not necessary to use it here
      //the controller that needs the response will await
      student: { id: studentId },
      course: { id: courseId },
    });
  }
}
