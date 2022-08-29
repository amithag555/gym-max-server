import { enumTrainingType, Training } from '@prisma/client';

export class TrainingModel implements Training {
  id: number;
  memberId: number;
  date: Date;
  startTime: Date;
  endtTime: Date;
  type: enumTrainingType;
}
