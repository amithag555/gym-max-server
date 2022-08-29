import { Club } from '@prisma/client';

export class ClubModel implements Club {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  currentMembersCount: number;
}
