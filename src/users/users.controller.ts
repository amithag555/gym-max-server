import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ThinUserDto } from './dto/thin-user.dto';
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
  ): Promise<ThinUserDto[]> {
    return await this.userService.getUsersByPageNumberAndPerPage(
      pageNumber,
      perPageNumber,
    );
  }

  @Get('/usersCount')
  @Roles(EnumRole.ADMIN)
  async getUsersCount(): Promise<number> {
    return await this.userService.getUsersCount();
  }

  @Get('/searchUsersCount')
  @Roles(EnumRole.ADMIN)
  async getSearchUsersCount(@Query('q') searchText: string): Promise<number> {
    return await this.userService.getSearchUsersCount(searchText);
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
  ): Promise<ThinUserDto[]> {
    return await this.userService.getUsersByUsername(
      pageNumber,
      perPageNumber,
      searchText,
    );
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserModel> {
    return await this.userService.getUserById(id);
  }

  @Post()
  @Roles(EnumRole.ADMIN)
  async createUser(@Body() newUser: CreateUserDto): Promise<UserModel> {
    return await this.userService.createUser(newUser);
  }

  @Put(':id')
  @Roles(EnumRole.ADMIN)
  async editUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userToEdit: EditUserDto,
  ): Promise<UserModel> {
    return await this.userService.editUserById(id, userToEdit);
  }

  @Put('/password/:id')
  @Roles(EnumRole.ADMIN)
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() newPassword: UpdatePasswordDto,
  ): Promise<UserModel> {
    return await this.userService.updatePassword(id, newPassword);
  }

  @Delete(':id')
  @Roles(EnumRole.ADMIN)
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModel> {
    return await this.userService.deleteUserById(id);
  }
}
