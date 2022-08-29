import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TrainingPlanController } from './training-plan.controller';
import { TrainingPlanService } from './training-plan.service';

@Module({
  imports: [AuthModule],
  controllers: [TrainingPlanController],
  providers: [TrainingPlanService],
})
export class TrainingPlanModule {}
