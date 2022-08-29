import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/models/create-user.dto';
import { LoginUserDto } from 'src/models/login-user.dto';
import { UpdatePasswordDto } from 'src/models/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsersByPageNumberAndPerPage(
    pageNumber: number,
    perPageNumber: number,
  ): Promise<UserModel[]> {
    try {
      return await this.prisma.user.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        orderBy: {
          username: 'asc',
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      return await this.prisma.user.count();
    } catch (error) {
      return error;
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
      return error;
    }
  }

  async getUsersByUsername(
    pageNumber: number,
    perPageNumber: number,
    searchText: string,
  ): Promise<UserModel[]> {
    try {
      return await this.prisma.user.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        where: {
          username: {
            contains: searchText,
          },
        },
        orderBy: {
          username: 'asc',
        },
      });
    } catch (error) {
      return error.response;
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
        throw new NotFoundException('User not found!');
      }

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      return error;
    }
  }

  async getUserByTokenUsername(user: UserModel): Promise<UserModel> {
    try {
      const userReturned = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });

      if (!userReturned) {
        throw new NotFoundException('User not found!');
      }

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      return error;
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
        throw new ConflictException('Username already exists');
      } else {
        return error;
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

      if (!userReturned) {
        return null;
      }

      userReturned.password = '*****';
      return userReturned;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      } else {
        return error;
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
      return error;
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
      return error;
    }
  }

  async validateUserLoginDetails(
    userDetails: LoginUserDto,
  ): Promise<UserModel> {
    const returnedUser = await this.prisma.user.findUnique({
      where: {
        username: userDetails.username,
      },
    });

    if (!returnedUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const validatePassword = await compare(
      userDetails.password,
      returnedUser.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return returnedUser;
  }
}
