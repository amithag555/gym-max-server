import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      return error;
    }
  }

  async getTrainingPlansCount(): Promise<number> {
    try {
      return await this.prisma.trainingPlan.count();
    } catch (error) {
      return error;
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
      return error;
    }
  }

  async getAllTrainingPlansByMemberId(
    memberId: number,
  ): Promise<TrainingPlanModel[]> {
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
  }

  async getTrainingPlansByMemberIdPageNumberAndPerPage(
    memberId: number,
    pageNumber: number,
    perPageNumber: number,
  ): Promise<TrainingPlanModel[]> {
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
    }
  }

  async createTrainingPlan(
    newTrainingPlan: CreateTrainingPlanDto,
  ): Promise<TrainingPlanModel> {
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
  }

  async createExercise(newExercise: CreateExerciseDto): Promise<ExerciseModel> {
    return await this.prisma.exercise.create({
      data: newExercise,
    });
  }

  async editTrainingPlan(
    trainingPlanToEdit: EditTrainingPlanDto,
    id: number,
  ): Promise<TrainingPlanModel> {
    return await this.prisma.trainingPlan.update({
      where: {
        id: id,
      },
      data: trainingPlanToEdit,
    });
  }

  async editPlainItem(
    plainItemToEdit: EditPlainItemDto,
    id: number,
  ): Promise<PlainItemModel> {
    return await this.prisma.plainItem.update({
      where: {
        id: id,
      },
      data: plainItemToEdit,
    });
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
    }
  }

  async deletePlanItem(planItemId: number): Promise<PlainItemModel> {
    await this.deleteAllExercisesByPlanItemId(planItemId);

    return await this.prisma.plainItem.delete({
      where: {
        id: planItemId,
      },
    });
  }

  async deleteExercise(exerciseId: number): Promise<ExerciseModel> {
    return await this.prisma.exercise.delete({
      where: {
        id: exerciseId,
      },
    });
  }

  async deleteTrainingPlan(id: number): Promise<TrainingPlanModel> {
    await this.deleteAllPlanItemsByTrainingPlanId(id);

    return await this.prisma.trainingPlan.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteAllPlanItemsByTrainingPlanId(id: number) {
    const planItemsToDelete = await this.getAllPlanItemsByTrainingPlanId(id);

    // planItemsToDelete.forEach(async (item) => {
    //   await this.deleteAllExercisesByPlanItemId(item.id);
    // });

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
  }

  async getAllPlanItemsByTrainingPlanId(id: number): Promise<PlainItemModel[]> {
    return await this.prisma.plainItem.findMany({
      where: {
        trainingPlanId: id,
      },
    });
  }

  async deleteAllExercisesByPlanItemId(planItemId: number) {
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
  }
}
