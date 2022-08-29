import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { CreateUserDto } from 'src/models/create-user.dto';
import { UpdatePasswordDto } from 'src/models/update-password.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(ControlAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/byPage')
  @Roles(EnumRole.ADMIN)
  async getUsersByPageNumberAndPerPage(
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
  ): Promise<UserModel[]> {
    try {
      return await this.userService.getUsersByPageNumberAndPerPage(
        pageNumber,
        perPageNumber,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/usersCount')
  @Roles(EnumRole.ADMIN)
  async getUsersCount(): Promise<number> {
    try {
      return await this.userService.getUsersCount();
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/searchUsersCount')
  @Roles(EnumRole.ADMIN)
  async getSearchUsersCount(@Query('q') searchText: string): Promise<number> {
    try {
      return await this.userService.getSearchUsersCount(searchText);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/byToken')
  @Roles(EnumRole.ADMIN, EnumRole.TRAINER, EnumRole.RECEPTION)
  async getUserByTokenUsername(@GetUser() user: UserModel): Promise<UserModel> {
    return await this.userService.getUserByTokenUsername(user);
  }

  @Get('/search')
  @Roles(EnumRole.ADMIN)
  async getUsersByUsername(
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
    @Query('q') searchText: string,
  ): Promise<UserModel[]> {
    try {
      return await this.userService.getUsersByUsername(
        pageNumber,
        perPageNumber,
        searchText,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserModel> {
    return await this.userService.getUserById(id);
  }

  @Post()
  @Roles(EnumRole.ADMIN)
  async createUser(@Body() newUser: CreateUserDto): Promise<UserModel> {
    try {
      return await this.userService.createUser(newUser);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put(':id')
  @Roles(EnumRole.ADMIN)
  async editUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userToEdit: EditUserDto,
  ): Promise<UserModel> {
    try {
      return await this.userService.editUserById(id, userToEdit);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put('/password/:id')
  @Roles(EnumRole.ADMIN)
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() newPassword: UpdatePasswordDto,
  ): Promise<UserModel> {
    try {
      return await this.userService.updatePassword(id, newPassword);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Delete(':id')
  @Roles(EnumRole.ADMIN)
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModel> {
    try {
      return await this.userService.deleteUserById(id);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
