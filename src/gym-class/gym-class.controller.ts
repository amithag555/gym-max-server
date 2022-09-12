import {
  Body,
  Controller,
  Delete,
  Get,
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
    return await this.gymClassService.getAllGymClasses();
  }

  @Get('/:day')
  @Roles(EnumRole.MEMBER)
  async getGymClassesByDay(
    @Param('day') day: EnumDay,
  ): Promise<GymClassModel[]> {
    return await this.gymClassService.getGymClassesByDay(day);
  }

  @Get('/byId/:gymClassId')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getGymClassById(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.getGymClassById(gymClassId);
  }

  @Post()
  @Roles(EnumRole.ADMIN)
  async createGymClass(
    @Body() newGymClass: GymClassDto,
  ): Promise<GymClassModel> {
    return await this.gymClassService.createGymClass(newGymClass);
  }

  @Put('edit/:gymClassId')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async editGymClass(
    @Body() gymClassToEdit: GymClassDto,
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.editGymClass(gymClassToEdit, gymClassId);
  }

  @Put('addMember/:gymClassId/:memberId')
  @Roles(EnumRole.MEMBER)
  async addMemberToGymClass(
    @Param('gymClassId') gymClassId: number,
    @Param('memberId') memberId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.addMemberToGymClass(gymClassId, memberId);
  }

  @Put('removeMember/:gymClassId/:memberId')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.GymClassId)
  async removeMemberFromGymClass(
    @Param('gymClassId', ParseIntPipe) gymClassId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.removeMemberFromGymClass(
      gymClassId,
      memberId,
    );
  }

  @Put('removeAllMembers/:gymClassId')
  @Roles(EnumRole.ADMIN)
  async removeAllMembersFromGymClass(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.removeAllMembersFromGymClass(gymClassId);
  }

  @Put('clearClasses')
  @Roles(EnumRole.ADMIN)
  async removeAllMembersFromAllGymClasses(): Promise<GymClassModel[]> {
    return await this.gymClassService.removeAllMembersFromAllGymClasses();
  }

  @Delete('/:gymClassId')
  @Roles(EnumRole.ADMIN)
  async deleteGymClassById(
    @Param('gymClassId') gymClassId: number,
  ): Promise<GymClassModel> {
    return await this.gymClassService.deleteGymClassById(gymClassId);
  }
}
