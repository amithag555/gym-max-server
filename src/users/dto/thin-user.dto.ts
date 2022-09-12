import { EnumRole } from '@prisma/client';

export class ThinUserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: EnumRole;
  isActive: boolean;
}
