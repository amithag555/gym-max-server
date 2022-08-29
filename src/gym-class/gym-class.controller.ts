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
  UseGuards,
} from '@nestjs/common';
import { EnumDay, EnumRole } from '@prisma/client';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';
import { AuthorizeContext } from 'src/decorators/authorize-context.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { GymClassDto } from './dto/gym-class.dto';
import { GymClassService } from './gym-class.service';
import { GymClassModel } from './models/gymClass.model';

@Controller('gymClasses')
@UseGuards(ControlAuthGuard)
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Get()
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER)
  async getAllGymClasses(): Promise<GymClassModel[]> {
    try {
      return await this.gymClassService.getAllGymClasses();
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/:day')
  @Roles(EnumRole.MEMBER)
  async getGymClassesByDay(
    @Param('day') day: EnumDay,
  ): Promise<GymClassModel[]> {
    try {
      return await this.gymClassService.getGymClassesByDay(day);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/:gymClassId')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getGymClassById(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.getGymClassById(gymClassId);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Post()
  @Roles(EnumRole.ADMIN)
  async createGymClass(
    @Body() newGymClass: GymClassDto,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.createGymClass(newGymClass);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put('edit/:gymClassId')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async editGymClass(
    @Body() gymClassToEdit: GymClassDto,
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.editGymClass(
        gymClassToEdit,
        gymClassId,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put('addMember/:gymClassId/:memberId')
  @Roles(EnumRole.MEMBER)
  async addMemberToGymClass(
    @Param('gymClassId') gymClassId: number,
    @Param('memberId') memberId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.addMemberToGymClass(
        gymClassId,
        memberId,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put('removeMember/:gymClassId/:memberId')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.GymClassId)
  async removeMemberFromGymClass(
    @Param('gymClassId', ParseIntPipe) gymClassId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.removeMemberFromGymClass(
        gymClassId,
        memberId,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Put('removeAllMembers/:gymClassId')
  @Roles(EnumRole.ADMIN)
  async removeAllMembersFromGymClass(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.removeAllMembersFromGymClass(
        gymClassId,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Delete('/:gymClassId')
  @Roles(EnumRole.ADMIN)
  async deleteGymClassById(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    try {
      return await this.gymClassService.deleteGymClassById(gymClassId);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
