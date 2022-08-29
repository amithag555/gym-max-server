import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WorkoutGoalController } from './workout-goal.controller';
import { WorkoutGoalService } from './workout-goal.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkoutGoalController],
  providers: [WorkoutGoalService],
})
export class WorkoutGoalModule {}
