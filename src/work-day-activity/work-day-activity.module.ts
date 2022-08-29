import { Module } from '@nestjs/common';
import { WorkDayActivityController } from './work-day-activity.controller';
import { WorkDayActivityService } from './work-day-activity.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkDayActivityController],
  providers: [WorkDayActivityService],
})
export class WorkDayActivityModule {}
