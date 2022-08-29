import { TrainingPlan } from '@prisma/client';

export class TrainingPlanModel implements TrainingPlan {
  id: number;
  title: string;
  trainerName: string;
  memberId: number;
}
