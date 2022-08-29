import { EnumRole, User } from '@prisma/client';

export class UserModel implements User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: EnumRole;
  password: string;
  isActive: boolean;
}
