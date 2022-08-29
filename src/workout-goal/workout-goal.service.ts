import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutGoalDto } from './dto/create-workout-goal.dto';
import { EditWorkoutGoalDto } from './dto/edit-workout-goal.dto';
import { WorkoutGoalModel } from './models/workout-goal.model';

@Injectable()
export class WorkoutGoalService {
  constructor(private prisma: PrismaService) {}

  async getCurrentMemberWorkoutGoal(
    memberId: number,
  ): Promise<WorkoutGoalModel> {
    try {
      const currentDate = new Date(
        `${new Date().getFullYear().toString()}-${(
          new Date().getMonth() + 1
        ).toString()}-02`,
      );

      return await this.prisma.workoutGoal.findFirst({
        where: {
          date: currentDate,
          memberId: memberId,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getMemberWorkoutGoalsByYear(
    memberId: number,
    year: number,
  ): Promise<WorkoutGoalModel[]> {
    try {
      return await this.prisma.workoutGoal.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
          memberId: memberId,
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      return error;
    }
  }

  async createWorkoutGoal(
    newWorkoutGoal: CreateWorkoutGoalDto,
    memberId: number,
  ): Promise<WorkoutGoalModel> {
    try {
      const tempDate = new Date(
        `${new Date().getFullYear().toString()}-${(
          new Date().getMonth() + 1
        ).toString()}-02`,
      );

      const currentWorkoutGoal = await this.getCurrentMemberWorkoutGoal(
        memberId,
      );

      if (currentWorkoutGoal) {
        return null;
      }

      return await this.prisma.workoutGoal.create({
        data: {
          ...newWorkoutGoal,
          date: tempDate,
          currentTrainingNumber: 0,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async deleteWorkoutGoalById(id: number): Promise<WorkoutGoalModel> {
    try {
      return await this.prisma.workoutGoal.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async editCurrentWorkoutGoal(
    id: number,
    workoutGoalToEdit: EditWorkoutGoalDto,
  ): Promise<WorkoutGoalModel> {
    try {
      return await this.prisma.workoutGoal.update({
        where: {
          id: id,
        },
        data: {
          ...workoutGoalToEdit,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async updateCurrentTrainingNumberByWorkoutGoalId(
    id: number,
  ): Promise<WorkoutGoalModel> {
    try {
      return await this.prisma.workoutGoal.update({
        where: {
          id: id,
        },
        data: {
          currentTrainingNumber: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      return error;
    }
  }
}
