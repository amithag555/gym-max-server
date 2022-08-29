import { Exercise } from '@prisma/client';

export class ExerciseModel implements Exercise {
  id: number;
  title: string;
  setsNumber: number;
  repetitionsNumber: number;
  machineNumber: string;
  weight: number;
  plainItemId: number;
}
