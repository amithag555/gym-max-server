import { PlainItem } from '@prisma/client';

export class PlainItemModel implements PlainItem {
  id: number;
  muscleName: string;
  trainingPlanId: number;
}
