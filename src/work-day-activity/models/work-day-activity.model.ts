import { WorkDayActivity } from '@prisma/client';

export class WorkDayActivityModel implements WorkDayActivity {
  id: number;
  date: Date;
  count: number;
}
