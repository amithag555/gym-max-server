import { WorkoutGoal } from '@prisma/client';

export class WorkoutGoalModel implements WorkoutGoal {
  id: number;
  date: Date;
  trainingNumber: number;
  currentTrainingNumber: number;
  memberId: number;
}
