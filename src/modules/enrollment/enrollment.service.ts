import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollCourseDto } from './dtos/enroll-course.dto';
import { CourseService } from '../courses/courses.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateEnrollmentStatusDto } from './dtos/update-enrollment-status.dto';
import { User } from '../user/entities/user.entity';

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
    if (enrollment.status === 'approved') {
      throw new ConflictException('Enrollment already approved');
    }
    //status actions
    //if the status is approved, the admin will be the approvedBy
    //if the status is rejected, the admin will be the rejectedBy
    const statusActions = {
      approved: () => {
        enrollment.status = 'approved';
        enrollment.approvedAt = new Date();
        enrollment.approvedBy = { id: adminId } as User ;
      },
      rejected: () => {
        enrollment.status = 'rejected';
        enrollment.rejectedAt = new Date();
        enrollment.rejectedBy = { id: adminId } as User;
      },
    };

    const action = statusActions[status];
    if (!action) throw new ConflictException('Invalid status');
    action(); //call the function based on the status

    return this.enrollmentRepository.save(enrollment);
  }

  /**service for student to drop enrolled course */
  async dropCourse(enrollmentId: number, studentId: number):Promise<Enrollment>{
    const enrollment = await this.getEnrollmentById(enrollmentId);
    if (enrollment.status !== 'approved') {
      throw new ConflictException('You can only drop after approval');
    }
    if (enrollment.student.id !== studentId) {
      throw new ConflictException('Student not authorized to drop course');
    }
    //drop course
    enrollment.droppedAt = new Date();
    return this.enrollmentRepository.save(enrollment);
  }


  async getEnrollmentById(enrollmentId: number): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['student', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
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
