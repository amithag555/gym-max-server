import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymClassDto } from './dto/gym-class.dto';
import { GymClassModel } from './models/gymClass.model';
import { EnumDay } from '@prisma/client';

@Injectable()
export class GymClassService {
  constructor(private prisma: PrismaService) {}

  async getAllGymClasses(): Promise<GymClassModel[]> {
    try {
      return await this.prisma.gymClass.findMany({
        orderBy: [
          {
            day: 'asc',
          },
          {
            startHour: 'asc',
          },
        ],
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getGymClassesByDay(day: EnumDay): Promise<GymClassModel[]> {
    try {
      return await this.prisma.gymClass.findMany({
        where: {
          day: day,
          isActive: true,
        },
        orderBy: [
          {
            startHour: 'asc',
          },
        ],
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getGymClassById(gymClassId: number): Promise<GymClassModel> {
    try {
      return await this.prisma.gymClass.findUnique({
        where: {
          id: gymClassId,
        },
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async createGymClass(newGymClass: GymClassDto): Promise<GymClassModel> {
    const splitHour = newGymClass.startHour.split(':');
    const currentDate = new Date('1970-01-01');

    currentDate.setUTCHours(parseInt(splitHour[0]), parseInt(splitHour[1]));

    try {
      return await this.prisma.gymClass.create({
        data: {
          ...newGymClass,
          startHour: currentDate,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async editGymClass(
    gymClassToEdit: GymClassDto,
    gymClassId: number,
  ): Promise<GymClassModel> {
    const splitHour = gymClassToEdit.startHour.split(':');
    const currentDate = new Date('1970-01-01');

    currentDate.setUTCHours(parseInt(splitHour[0]), parseInt(splitHour[1]));

    try {
      return await this.prisma.gymClass.update({
        where: {
          id: gymClassId,
        },
        data: {
          ...gymClassToEdit,
          startHour: currentDate,
        },
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async deleteGymClassById(gymClassId: number): Promise<GymClassModel> {
    try {
      await this.removeAllMembersFromGymClass(gymClassId);

      return await this.prisma.gymClass.delete({
        where: {
          id: gymClassId,
        },
      });
    } catch (error) {
      if (error.response.code === 'P2025') {
        throw new HttpException('Record to delete not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async addMemberToGymClass(
    gymClassId: number,
    memberId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.prisma.gymClass.update({
        where: {
          id: gymClassId,
        },
        data: {
          members: {
            connect: {
              id: memberId,
            },
          },
        },
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new HttpException(
          'No parent or nested record was found for disconnect',
          404,
        );
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async removeMemberFromGymClass(
    gymClassId: number,
    memberId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.prisma.gymClass.update({
        where: {
          id: gymClassId,
        },
        data: {
          members: {
            disconnect: {
              id: memberId,
            },
          },
        },
        include: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          'No parent record was found for a nested disconnect',
          404,
        );
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async removeAllMembersFromGymClass(
    gymClassId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.prisma.gymClass.update({
        where: {
          id: gymClassId,
        },
        data: {
          members: {
            set: [],
          },
        },
        include: {
          members: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          'No parent record was found for a nested disconnect',
          404,
        );
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async removeAllMembersFromAllGymClasses(): Promise<GymClassModel[]> {
    try {
      const gymClasses = await this.getAllGymClasses();

      if (!gymClasses) {
        return null;
      }

      const returnedGymClasses = new Array<GymClassModel>();

      for (const item of gymClasses) {
        const gymClass = await this.removeAllMembersFromGymClass(item.id);
        returnedGymClasses.push(gymClass);
      }

      return returnedGymClasses;
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }
}
