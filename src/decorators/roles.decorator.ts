//Authorization decorator to be used on resolvers and controllers together with the jwt-guard
import { SetMetadata } from '@nestjs/common';
import { EnumRole } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Roles = (...roles: EnumRole[]) =>
  SetMetadata<string, EnumRole[]>('roles', roles);
