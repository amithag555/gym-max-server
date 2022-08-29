import { ActivityPerHour } from '@prisma/client';

export class ActivityPerHourModel implements ActivityPerHour {
  id: number;
  hour: Date;
  count: number;
  workDayActivityId: number;
}
