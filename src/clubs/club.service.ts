import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClubModel } from './models/club.model';

@Injectable()
export class ClubService {
  constructor(private prisma: PrismaService) {}

  async getClubById(id: number): Promise<ClubModel> {
    try {
      return await this.prisma.club.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
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
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
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
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
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
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
