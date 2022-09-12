import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/models/create-user.dto';
import { LoginUserDto } from 'src/models/login-user.dto';
import { UpdatePasswordDto } from 'src/models/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';
import { ThinUserDto } from './dto/thin-user.dto';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsersByPageNumberAndPerPage(
    pageNumber: number,
    perPageNumber: number,
  ): Promise<ThinUserDto[]> {
    try {
      return await this.prisma.user.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
        orderBy: {
          username: 'asc',
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      return await this.prisma.user.count();
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getSearchUsersCount(searchText: string): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: {
          username: {
            contains: searchText,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getUsersByUsername(
    pageNumber: number,
    perPageNumber: number,
    searchText: string,
  ): Promise<ThinUserDto[]> {
    try {
      return await this.prisma.user.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        where: {
          username: {
            contains: searchText,
          },
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
        orderBy: {
          username: 'asc',
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getUserById(id: number): Promise<UserModel> {
    try {
      const userReturned = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!userReturned) {
        return null;
      }

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getUserByTokenUsername(user: UserModel): Promise<UserModel> {
    try {
      const userReturned = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async createUser(newUser: CreateUserDto): Promise<UserModel> {
    try {
      newUser.password = await hash(newUser.password, 10);

      const newUserReturned = await this.prisma.user.create({
        data: newUser,
      });

      newUserReturned.password = '*****';
      return newUserReturned;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Username already exists', 409);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async editUserById(id: number, userToEdit: EditUserDto): Promise<UserModel> {
    try {
      const userReturned = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: userToEdit,
      });

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Username already exists', 409);
      } else if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async updatePassword(
    id: number,
    newPassword: UpdatePasswordDto,
  ): Promise<UserModel> {
    try {
      newPassword.password = await hash(newPassword.password, 10);

      const userReturned = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: newPassword.password,
        },
      });

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to update not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async deleteUserById(id: number): Promise<UserModel> {
    try {
      const userReturned = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Record to delete not found', 404);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  async validateUserLoginDetails(
    userDetails: LoginUserDto,
  ): Promise<UserModel> {
    try {
      const returnedUser = await this.prisma.user.findUnique({
        where: {
          username: userDetails.username,
        },
      });

      if (!returnedUser) {
        throw new UnauthorizedException();
      }

      const validatePassword = await compare(
        userDetails.password,
        returnedUser.password,
      );

      if (!validatePassword) {
        throw new UnauthorizedException();
      }

      return returnedUser;
    } catch (error) {
      if (error.response.statusCode === 401) {
        throw new HttpException('Invalid username or password', 401);
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
