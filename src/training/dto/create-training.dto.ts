import { enumTrainingType } from '@prisma/client';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTrainingDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  startTime: Date;

  @IsOptional()
  endtTime: Date;

  @IsNotEmpty()
  @IsIn([
    enumTrainingType.AEROBIC,
    enumTrainingType.GYMCLASS,
    enumTrainingType.A,
    enumTrainingType.B,
    enumTrainingType.C,
    enumTrainingType.FULLBODY,
    enumTrainingType.SWIMMING,
  ])
  type: enumTrainingType;
}
