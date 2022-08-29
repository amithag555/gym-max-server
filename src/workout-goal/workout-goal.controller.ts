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
import { EnumRole } from '@prisma/client';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthorizeContext } from 'src/decorators/authorize-context.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { MemberModel } from 'src/members/models/member.model';
import { CreateWorkoutGoalDto } from './dto/create-workout-goal.dto';
import { EditWorkoutGoalDto } from './dto/edit-workout-goal.dto';
import { WorkoutGoalModel } from './models/workout-goal.model';
import { WorkoutGoalService } from './workout-goal.service';

@Controller('workoutGoal')
@UseGuards(ControlAuthGuard)
export class WorkoutGoalController {
  constructor(private readonly workoutGoalService: WorkoutGoalService) {}

  @Get()
  @Roles(EnumRole.MEMBER)
  async getCurrentMemberWorkoutGoal(
    @GetUser() member: MemberModel,
  ): Promise<WorkoutGoalModel> {
    return await this.workoutGoalService.getCurrentMemberWorkoutGoal(member.id);
  }

  @Get('/byYear/:year')
  @Roles(EnumRole.MEMBER)
  async getMemberWorkoutGoalsByYear(
    @GetUser() member: MemberModel,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<WorkoutGoalModel[]> {
    return await this.workoutGoalService.getMemberWorkoutGoalsByYear(
      member.id,
      year,
    );
  }

  @Post()
  @Roles(EnumRole.MEMBER)
  async createWorkoutGoal(
    @GetUser() member: MemberModel,
    @Body() newWorkoutGoal: CreateWorkoutGoalDto,
  ): Promise<WorkoutGoalModel> {
    return await this.workoutGoalService.createWorkoutGoal(
      newWorkoutGoal,
      member.id,
    );
  }

  @Put(':id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.WorkoutGoalId)
  async editCurrentWorkoutGoal(
    @Param('id', ParseIntPipe) id: number,
    @Body() workoutGoalToEdit: EditWorkoutGoalDto,
  ): Promise<WorkoutGoalModel> {
    return await this.workoutGoalService.editCurrentWorkoutGoal(
      id,
      workoutGoalToEdit,
    );
  }

  @Put('update/:id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.WorkoutGoalId)
  async updateCurrentTrainingNumberByWorkoutId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WorkoutGoalModel> {
    return await this.workoutGoalService.updateCurrentTrainingNumberByWorkoutGoalId(
      id,
    );
  }

  @Delete(':id')
  @Roles(EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.WorkoutGoalId)
  async deleteWorkoutGoalById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WorkoutGoalModel> {
    return await this.workoutGoalService.deleteWorkoutGoalById(id);
  }
}
