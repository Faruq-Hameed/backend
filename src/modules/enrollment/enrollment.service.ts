import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollCourseDto } from './dtos/enroll-course.dto';
import { CourseService } from '../courses/courses.service';
import { ConflictException } from '@nestjs/common';
import { UpdateEnrollmentStatusDto } from './dtos/update-enrollment-status.dto';

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

  /**update enrollment status by admin*/
  async approveEnrollment(
    updateEnrollmentStatusDto: UpdateEnrollmentStatusDto,
    adminId: number,
  ): Promise<Enrollment> {
    const { enrollmentId, status } = updateEnrollmentStatusDto;
    const enrollment = await this.getEnrollmentById(enrollmentId);
    if (!enrollment || enrollment.status === 'approved') {
      throw new ConflictException('Enrollment not found or already approved');
    }
     if (!enrollment || enrollment.status === 'approved') {
      throw new ConflictException('Enrollment not found or already approved');
    }
    //status actions 
    //if the status is approved, the admin will be the approvedBy
    //if the status is rejected, the admin will be the rejectedBy
    const statusActions = {
      approved: () => {
        enrollment.status = 'approved';
        enrollment.approvedAt = new Date();
        enrollment.approvedBy = { id: adminId } as any;
      },
      rejected: () => {
        enrollment.status = 'rejected';
        enrollment.rejectedAt = new Date();
        enrollment.rejectedBy = { id: adminId } as any;
      },
    };

    const action = statusActions[status];
    if (!action) throw new ConflictException('Invalid status');
    action(); //call the function based on the status

    return this.enrollmentRepository.save(enrollment);
  }

  async getEnrollmentById(enrollmentId: number): Promise<Enrollment> {
    return this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['student', 'course'],
    });
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'course'],
    });
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { course: { id: courseId } },
      relations: ['student', 'course'],
    });
  }
}
