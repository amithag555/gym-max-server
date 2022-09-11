import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingPlanDto } from './dto/create-training-plan.dto';
import { TrainingPlanModel } from './models/trainingPlan.model';
import { EditTrainingPlanDto } from './dto/edit-training-plan.dto';
import { EditPlainItemDto } from './dto/edit-plain-item.dto';
import { EditExerciseDto } from './dto/edit-exercise.dto';
import { PlainItemModel } from './models/plainItem.model';
import { CreatePlainItemDto } from './dto/create-plain-item.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseModel } from './models/exercise.model';

@Injectable()
export class TrainingPlanService {
  constructor(private prisma: PrismaService) {}

  async getTrainingPlansByPageNumberAndPerPage(
    pageNumber: number,
    perPageNumber: number,
  ): Promise<TrainingPlanModel[]> {
    try {
      return await this.prisma.trainingPlan.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        include: {
          plainItems: {
            include: {
              exercises: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getTrainingPlansCount(): Promise<number> {
    try {
      return await this.prisma.trainingPlan.count();
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getMemberTrainingPlansCount(memberId: number): Promise<number> {
    try {
      return await this.prisma.trainingPlan.count({
        where: {
          memberId: memberId,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getAllTrainingPlansByMemberId(
    memberId: number,
  ): Promise<TrainingPlanModel[]> {
    try {
      return await this.prisma.trainingPlan.findMany({
        where: { memberId: memberId },
        include: {
          plainItems: {
            include: {
              exercises: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getTrainingPlansByMemberIdPageNumberAndPerPage(
    memberId: number,
    pageNumber: number,
    perPageNumber: number,
  ): Promise<TrainingPlanModel[]> {
    try {
      return await this.prisma.trainingPlan.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        where: { memberId: memberId },
        include: {
          plainItems: {
            include: {
              exercises: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getTrainingPlanById(
    trainingPlanId: number,
  ): Promise<TrainingPlanModel> {
    try {
      return await this.prisma.trainingPlan.findUnique({
        where: { id: trainingPlanId },
        include: {
          plainItems: {
            include: {
              exercises: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async createTrainingPlan(
    newTrainingPlan: CreateTrainingPlanDto,
  ): Promise<TrainingPlanModel> {
    try {
      const createdTrainingPlan = await this.prisma.trainingPlan.create({
        data: {
          title: newTrainingPlan.title,
          trainerName: newTrainingPlan.trainerName,
          plainItems: {
            create: [],
          },
          memberId: newTrainingPlan.memberId,
        },
      });

      await this.addPlainItemsToTrainingPlan(
        createdTrainingPlan.id,
        newTrainingPlan,
      );

      return await this.getTrainingPlanById(createdTrainingPlan.id);
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async addPlainItemsToTrainingPlan(
    trainingPlanId: number,
    newTrainingPlan: CreateTrainingPlanDto,
  ) {
    const { plainItems } = newTrainingPlan;

    for (const item of plainItems) {
      await this.prisma.trainingPlan.update({
        where: {
          id: trainingPlanId,
        },
        data: {
          plainItems: {
            create: {
              muscleName: item.muscleName,
              exercises: {
                create: item.exercises,
              },
            },
          },
        },
      });
    }
  }

  async createPlanItem(
    newPlanItem: CreatePlainItemDto,
  ): Promise<PlainItemModel> {
    try {
      return await this.prisma.plainItem.create({
        data: {
          muscleName: newPlanItem.muscleName,
          trainingPlanId: newPlanItem.trainingPlanId,
          exercises: {
            create: newPlanItem.exercises,
          },
        },
        include: {
          exercises: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new HttpException(
          'No parent record was found for connection',
          404,
        );
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async createExercise(newExercise: CreateExerciseDto): Promise<ExerciseModel> {
    try {
      return await this.prisma.exercise.create({
        data: newExercise,
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new HttpException(
          'No parent record was found for connection',
          404,
        );
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async editTrainingPlan(
    trainingPlanToEdit: EditTrainingPlanDto,
    id: number,
  ): Promise<TrainingPlanModel> {
    try {
      return await this.prisma.trainingPlan.update({
        where: {
          id: id,
        },
        data: trainingPlanToEdit,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async editPlainItem(
    plainItemToEdit: EditPlainItemDto,
    id: number,
  ): Promise<PlainItemModel> {
    try {
      return await this.prisma.plainItem.update({
        where: {
          id: id,
        },
        data: plainItemToEdit,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async editExercise(
    exerciseToEdit: EditExerciseDto,
    id: number,
  ): Promise<ExerciseModel> {
    try {
      return await this.prisma.exercise.update({
        where: {
          id: id,
        },
        data: exerciseToEdit,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async deletePlanItem(planItemId: number): Promise<PlainItemModel> {
    try {
      await this.deleteAllExercisesByPlanItemId(planItemId);

      return await this.prisma.plainItem.delete({
        where: {
          id: planItemId,
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

  async deleteExercise(exerciseId: number): Promise<ExerciseModel> {
    try {
      return await this.prisma.exercise.delete({
        where: {
          id: exerciseId,
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

  async deleteTrainingPlan(id: number): Promise<TrainingPlanModel> {
    try {
      await this.deleteAllPlanItemsByTrainingPlanId(id);

      return await this.prisma.trainingPlan.delete({
        where: {
          id: id,
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

  async deleteAllPlanItemsByTrainingPlanId(id: number) {
    try {
      const planItemsToDelete = await this.getAllPlanItemsByTrainingPlanId(id);

      for (const item of planItemsToDelete) {
        await this.deleteAllExercisesByPlanItemId(item.id);
      }

      await this.prisma.trainingPlan.update({
        where: {
          id: id,
        },
        data: {
          plainItems: {
            deleteMany: {},
          },
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getAllPlanItemsByTrainingPlanId(id: number): Promise<PlainItemModel[]> {
    try {
      return await this.prisma.plainItem.findMany({
        where: {
          trainingPlanId: id,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async deleteAllExercisesByPlanItemId(planItemId: number) {
    try {
      await this.prisma.plainItem.update({
        where: {
          id: planItemId,
        },
        data: {
          exercises: {
            deleteMany: {},
          },
        },
      });
    } catch (error) {
      return error;
    }
  }
}
