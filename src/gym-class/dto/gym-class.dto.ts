import { EnumDay, EnumGymClassType } from '@prisma/client';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class GymClassDto {
  @IsNotEmpty()
  @IsIn([
    EnumGymClassType.BODYSHAPE,
    EnumGymClassType.BOXING,
    EnumGymClassType.SPINNING,
    EnumGymClassType.SWIMMING,
    EnumGymClassType.YOGA,
  ])
  type: EnumGymClassType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  trainer: string;

  @IsNotEmpty()
  @IsIn([
    EnumDay.SUNDAY,
    EnumDay.MONDAY,
    EnumDay.TUESDAY,
    EnumDay.WEDNESDAY,
    EnumDay.THURSDAY,
    EnumDay.FRIDAY,
    EnumDay.SATURDAY,
  ])
  day: EnumDay;

  @IsOptional()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  startHour: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(90)
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(30)
  roomNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  maxMembers: number;
}
