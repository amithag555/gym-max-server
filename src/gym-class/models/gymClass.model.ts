import { EnumDay, EnumGymClassType, GymClass } from '@prisma/client';

export class GymClassModel implements GymClass {
  id: number;
  type: EnumGymClassType;
  trainer: string;
  day: EnumDay;
  isActive: boolean;
  startHour: Date;
  duration: number;
  roomNumber: number;
  maxMembers: number;
}
