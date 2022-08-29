import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateTrainingPlanDto } from './dto/create-training-plan.dto';
import { EditPlainItemDto } from './dto/edit-plain-item.dto';
import { EditTrainingPlanDto } from './dto/edit-training-plan.dto';
import { TrainingPlanModel } from './models/trainingPlan.model';
import { TrainingPlanService } from './training-plan.service';
import { EditExerciseDto } from './dto/edit-exercise.dto';
import { PlainItemModel } from './models/plainItem.model';
import { ExerciseModel } from './models/exercise.model';
import { CreatePlainItemDto } from './dto/create-plain-item.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRole } from '@prisma/client';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { AuthorizeContext } from 'src/decorators/authorize-context.decorator';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';

@Controller('trainingPlan')
@UseGuards(ControlAuthGuard)
export class TrainingPlanController {
  constructor(private readonly trainingPlanService: TrainingPlanService) {}

  @Get()
  @Roles(EnumRole.ADMIN, EnumRole.TRAINER)
  async getTrainingPlansByPageNumberAndPerPage(
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
  ): Promise<TrainingPlanModel[]> {
    return await this.trainingPlanService.getTrainingPlansByPageNumberAndPerPage(
      pageNumber,
      perPageNumber,
    );
  }

  @Get('/trainingPlansCount')
  @Roles(EnumRole.ADMIN, EnumRole.TRAINER)
  async getTrainingPlansCount(): Promise<number> {
    try {
      return await this.trainingPlanService.getTrainingPlansCount();
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/memberTrainingPlansCount/:memberId')
  @Roles(EnumRole.ADMIN, EnumRole.TRAINER)
  async getMemberTrainingPlansCount(
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<number> {
    try {
      return await this.trainingPlanService.getMemberTrainingPlansCount(
        memberId,
      );
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/:id')
  @Roles(EnumRole.ADMIN, EnumRole.MEMBER, EnumRole.TRAINER)
  @AuthorizeContext(AuthorizableOriginParameter.TrainingPlanId)
  async getTrainingPlanById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainingPlanModel> {
    try {
      return await this.trainingPlanService.getTrainingPlanById(id);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Get('/member/:memberId')
  @Roles(EnumRole.ADMIN, EnumRole.MEMBER, EnumRole.TRAINER)
  @AuthorizeContext(AuthorizableOriginParameter.MemberId)
  async getAllTrainingPlansByMemberId(
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<TrainingPlanModel[]> {
    return await this.trainingPlanService.getAllTrainingPlansByMemberId(
      memberId,
    );
  }

  @Get('/member/byPage/:memberId')
  @Roles(EnumRole.ADMIN, EnumRole.TRAINER)
  async getTrainingPlansByMemberIdPageNumberAndPerPage(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
  ): Promise<TrainingPlanModel[]> {
    return await this.trainingPlanService.getTrainingPlansByMemberIdPageNumberAndPerPage(
      memberId,
      pageNumber,
      perPageNumber,
    );
  }

  @Post()
  async createTrainingPlan(
    @Body() newTrainingPlan: CreateTrainingPlanDto,
  ): Promise<TrainingPlanModel> {
    return await this.trainingPlanService.createTrainingPlan(newTrainingPlan);
  }

  @Put(':id')
  @Roles(EnumRole.ADMIN, EnumRole.MEMBER, EnumRole.TRAINER)
  @AuthorizeContext(AuthorizableOriginParameter.TrainingPlanId)
  async editTrainingPlan(
    @Body() trainingPlanToEdit: EditTrainingPlanDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainingPlanModel> {
    return await this.trainingPlanService.editTrainingPlan(
      trainingPlanToEdit,
      id,
    );
  }

  @Put('/planItem/:id')
  @Roles(EnumRole.ADMIN, EnumRole.MEMBER, EnumRole.TRAINER)
  @AuthorizeContext(AuthorizableOriginParameter.PlanItemId)
  async editPlanItem(
    @Body() planItemToEdit: EditPlainItemDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlainItemModel> {
    return await this.trainingPlanService.editPlainItem(planItemToEdit, id);
  }

  @Put('/exercise/:id')
  @Roles(EnumRole.ADMIN, EnumRole.MEMBER, EnumRole.TRAINER)
  @AuthorizeContext(AuthorizableOriginParameter.ExerciseId)
  async editExercise(
    @Body() exerciseToEdit: EditExerciseDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExerciseModel> {
    try {
      return await this.trainingPlanService.editExercise(exerciseToEdit, id);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Delete(':id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.TrainingPlanId)
  async deleteTrainingPlan(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainingPlanModel> {
    return await this.trainingPlanService.deleteTrainingPlan(id);
  }

  @Delete('/planItem/:id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.PlanItemId)
  async deletePlanItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlainItemModel> {
    return await this.trainingPlanService.deletePlanItem(id);
  }

  @Delete('/exercise/:id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.ExerciseId)
  async deleteExercise(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExerciseModel> {
    return await this.trainingPlanService.deleteExercise(id);
  }

  @Post('/planItem')
  async createPlanItem(
    @Body() newPlanItem: CreatePlainItemDto,
  ): Promise<PlainItemModel> {
    return await this.trainingPlanService.createPlanItem(newPlanItem);
  }

  @Post('/exercise')
  async createExercise(
    @Body() newExercise: CreateExerciseDto,
  ): Promise<ExerciseModel> {
    return await this.trainingPlanService.createExercise(newExercise);
  }
}
