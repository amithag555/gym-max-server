import { SetMetadata } from '@nestjs/common';
import { EnumRole } from '@prisma/client';

export const Roles = (...roles: EnumRole[]) =>
  SetMetadata<string, EnumRole[]>('roles', roles);
