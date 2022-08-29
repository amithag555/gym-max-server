import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityPerHourDto } from './dto/create-activity-per-hour.dto';
import { ActivityPerHourModel } from './models/activity-per-hour.model';
import { WorkDayActivityModel } from './models/work-day-activity.model';

@Injectable()
export class WorkDayActivityService {
  constructor(private prisma: PrismaService) {}

  async getWorkDayActivityByDate(date: string): Promise<WorkDayActivityModel> {
    try {
      const tempDate = new Date(`${date} 00:00:00`);
      const newDate = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate() + 1,
      );

      return await this.prisma.workDayActivity.findFirst({
        where: {
          date: new Date(newDate),
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
      return error.response;
    }
  }

  async getCurrentWorkDayActivity(): Promise<WorkDayActivityModel> {
    try {
      const currentDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
      );

      return await this.prisma.workDayActivity.findFirst({
        where: {
          date: currentDate,
        },
        include: {
          activityPerHour: true,
        },
      });
    } catch (error) {
      return error.response;
    }
  }

  async createWorkDayActivity(): Promise<WorkDayActivityModel> {
    try {
      const currentDate = `${new Date().getFullYear().toString()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .toString()}-${new Date().getDate().toString()}`;

      const workDayActivity = await this.getWorkDayActivityByDate(
        `${currentDate}`,
      );

      if (!workDayActivity) {
        return await this.prisma.workDayActivity.create({
          data: {
            date: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 1,
            ),
          },
        });
      }
    } catch (error) {
      return error.response;
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

      const currentDate = `${new Date().getFullYear().toString()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .toString()}-${new Date().getDate().toString()}`;

      // After implement auto process change the hour property
      const hour = new Date(`${currentDate} ${newActivityPerHour.hour}:00`);

      return await this.prisma.activityPerHour.create({
        data: {
          hour: hour,
          // After implement auto process change the count property
          count: newActivityPerHour.count,
          workDayActivityId: workDayActivity.id,
        },
      });
    } catch (error) {
      return error.response;
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
      return error.response;
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
      return error.response;
    }
  }

  async updateCurrentWorkDayActivityCount(): Promise<WorkDayActivityModel> {
    try {
      const workDayActivity = await this.getCurrentWorkDayActivity();
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
      return error.response;
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
      return error.response;
    }
  }
}
