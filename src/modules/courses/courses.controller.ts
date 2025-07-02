// src/modules/course/course.controller.ts

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CourseService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { UserRole } from 'src/utils/userRole';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Public } from 'src/common/guards/public.guard';
@Controller('courses')
@UseGuards(RolesGuard) // if you want to restrict access to lecturers
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /** Create a course - only for lecturers */
  @Post()
  @SuccessMessage('New course created successfully')
  @Roles(UserRole.LECTURER) // You can create a RolesGuard to enforce this
  async create(@Req() req: RequestWithUser, @Body() dto: CreateCourseDto) {
    const lecturerId = req.user?.id;
    return this.courseService.createCourse(lecturerId, dto);
  }

  /** Get all courses */
  @Get()
  @Public()
  @SuccessMessage('Courses fetched successfully')
  async findAll() {
    return this.courseService.getAllCourses();
  }

  /** Get a course by ID */
  @Get(':id')
  @Public()
  @SuccessMessage('Course fetched successfully')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseById(id);
  }

  /** Update a course - only by its owner (lecturer) */
  @Patch(':id')
  @Roles(UserRole.LECTURER)
  @SuccessMessage('Course updated successfully')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateCourseDto,
  ) {
    const lecturerId = req.user?.id;
    return this.courseService.updateCourse(id, lecturerId, dto);
  }

  /** Delete a course - only by its owner (lecturer) */
  @Delete(':id')
  @Roles(UserRole.LECTURER)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const lecturerId = req.user?.id;
    return this.courseService.deleteCourse(id, lecturerId);
  }
}
