import { Module } from '@nestjs/common';
import { CourseController } from './courses.controller';
import { CourseService } from './courses.service';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CoursesModule {}
