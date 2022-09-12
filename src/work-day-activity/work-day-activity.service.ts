import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityPerHourDto } from './dto/create-activity-per-hour.dto';
import { ActivityPerHourModel } from './models/activity-per-hour.model';
import { WorkDayActivityModel } from './models/work-day-activity.model';

@Injectable()
export class WorkDayActivityService {
  constructor(private prisma: PrismaService) {}

  async getWorkDayActivityByDate(date: string): Promise<WorkDayActivityModel> {
    try {
      const tempDate = new Date(date);

      return await this.prisma.workDayActivity.findFirst({
        where: {
          date: tempDate,
        },
        include: {
          activityPerHour: {
            orderBy: {
              hour: 'asc',
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getCurrentWorkDayActivity(): Promise<WorkDayActivityModel> {
    try {
      const currentDate = new Date();

      currentDate.setUTCHours(0);
      currentDate.setUTCMinutes(0);
      currentDate.setUTCSeconds(0);
      currentDate.setUTCMilliseconds(0);

      return await this.prisma.workDayActivity.findFirst({
        where: {
          date: currentDate,
        },
        include: {
          activityPerHour: true,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async createWorkDayActivity(): Promise<WorkDayActivityModel> {
    try {
      const currentDate = new Date();

      currentDate.setUTCHours(0);
      currentDate.setUTCMinutes(0);
      currentDate.setUTCSeconds(0);
      currentDate.setUTCMilliseconds(0);

      const workDayActivity = await this.getWorkDayActivityByDate(
        currentDate.toUTCString(),
      );

      if (!workDayActivity) {
        return await this.prisma.workDayActivity.create({
          data: {
            date: currentDate,
          },
        });
      }
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async createActivityPerHour(
    newActivityPerHour: CreateActivityPerHourDto,
  ): Promise<ActivityPerHourModel> {
    try {
      let workDayActivity: WorkDayActivityModel;

      workDayActivity = await this.getCurrentWorkDayActivity();

      if (!workDayActivity) {
        workDayActivity = await this.createWorkDayActivity();
      }

      const currentHour = new Date();

      // After implement auto process change the hour property
      currentHour.setUTCHours(newActivityPerHour.hour);
      currentHour.setUTCMinutes(0);
      currentHour.setUTCSeconds(0);
      currentHour.setUTCMilliseconds(0);

      return await this.prisma.activityPerHour.create({
        data: {
          hour: currentHour,
          // After implement auto process change the count property
          count: newActivityPerHour.count,
          workDayActivityId: workDayActivity.id,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async deleteAllActivityPerHourFromWorkDayActivity(
    workDayActivityId: number,
  ): Promise<WorkDayActivityModel> {
    try {
      return await this.prisma.workDayActivity.update({
        where: {
          id: workDayActivityId,
        },
        data: {
          activityPerHour: {
            deleteMany: {},
          },
        },
      });
    } catch (error) {
      return error;
    }
  }

  async deleteWorkDayActivity(
    workDayActivityId: number,
  ): Promise<WorkDayActivityModel> {
    try {
      await this.deleteAllActivityPerHourFromWorkDayActivity(workDayActivityId);

      return await this.prisma.workDayActivity.delete({
        where: {
          id: workDayActivityId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to delete not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async updateCurrentWorkDayActivityCount(): Promise<WorkDayActivityModel> {
    try {
      const workDayActivity = await this.getCurrentWorkDayActivity();

      if (!workDayActivity) {
        throw new NotFoundException();
      }

      const countSum = await this.getCurrentWorkDayActivityCountSum(
        workDayActivity.id,
      );

      return await this.prisma.workDayActivity.update({
        where: {
          id: workDayActivity.id,
        },
        data: {
          count: countSum,
        },
      });
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async getCurrentWorkDayActivityCountSum(
    workDayActivityId: number,
  ): Promise<number> {
    try {
      const countSum = await this.prisma.activityPerHour.aggregate({
        _sum: {
          count: true,
        },
        where: {
          workDayActivityId: workDayActivityId,
        },
      });

      return countSum._sum.count;
    } catch (error) {
      return error;
    }
  }
}
