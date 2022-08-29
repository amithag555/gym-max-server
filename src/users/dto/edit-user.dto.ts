import { EnumRole } from '@prisma/client';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsIn([EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.SELLER, EnumRole.TRAINER])
  role: EnumRole;
}
