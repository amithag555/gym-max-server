import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      // throw new InternalServerErrorException(
      //   'There is a problem, try again later',
      // );

      return error.response;
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
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
      throw new InternalServerErrorException(
        'There is a problem, try again later',
      );
    }
  }
}
