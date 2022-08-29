import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateActivityPerHourDto } from './dto/create-activity-per-hour.dto';
import { WorkDayActivityModel } from './models/work-day-activity.model';
import { WorkDayActivityService } from './work-day-activity.service';
import { ActivityPerHourModel } from './models/activity-per-hour.model';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRole } from '@prisma/client';

@Controller('workDayActivity')
@UseGuards(ControlAuthGuard)
export class WorkDayActivityController {
  constructor(private workDayActivityService: WorkDayActivityService) {}

  @Get('/byDate')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER, EnumRole.MEMBER)
  async getWorkDayActivityByDate(
    @Query('q')
    date: string,
  ): Promise<WorkDayActivityModel> {
    try {
      return await this.workDayActivityService.getWorkDayActivityByDate(date);
    } catch (error) {
      return error.response;
    }
  }

  @Get()
  async getCurrentWorkDayActivity(): Promise<WorkDayActivityModel> {
    try {
      return await this.workDayActivityService.getCurrentWorkDayActivity();
    } catch (error) {
      return error.response;
    }
  }

  @Post()
  async createWorkDayActivity(): Promise<WorkDayActivityModel> {
    return await this.workDayActivityService.createWorkDayActivity();
  }

  @Post('/activityPerHour')
  async createActivityPerHour(
    @Body() newActivityPerHour: CreateActivityPerHourDto,
  ): Promise<ActivityPerHourModel> {
    return await this.workDayActivityService.createActivityPerHour(
      newActivityPerHour,
    );
  }

  @Put()
  async updateCurrentWorkDayActivityCount(): Promise<WorkDayActivityModel> {
    return await this.workDayActivityService.updateCurrentWorkDayActivityCount();
  }

  @Delete('/:workDayActivityId')
  async deleteWorkDayActivity(
    @Param('workDayActivityId') workDayActivityId: number,
  ): Promise<WorkDayActivityModel> {
    return await this.workDayActivityService.deleteWorkDayActivity(
      workDayActivityId,
    );
  }
}
