import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClubModel } from './models/club.model';

@Injectable()
export class ClubService {
  constructor(private prisma: PrismaService) {}

  async getClubById(id: number): Promise<ClubModel> {
    try {
      return await this.prisma.club.findFirst({
        where: {
          id: id,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async incrementClubCountById(id: number): Promise<ClubModel> {
    try {
      return await this.prisma.club.update({
        where: {
          id: id,
        },
        data: {
          currentMembersCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      return error;
    }
  }

  async decrementClubCountById(id: number): Promise<ClubModel> {
    try {
      return await this.prisma.club.update({
        where: {
          id: id,
        },
        data: {
          currentMembersCount: {
            decrement: 1,
          },
        },
      });
    } catch (error) {
      return error;
    }
  }

  async resetClubCountById(id: number): Promise<ClubModel> {
    try {
      return await this.prisma.club.update({
        where: {
          id: id,
        },
        data: {
          currentMembersCount: 0,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
