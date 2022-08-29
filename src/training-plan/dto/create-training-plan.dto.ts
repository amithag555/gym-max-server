import { CreatePlainItemDto } from './create-plain-item.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTrainingPlanDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  trainerName: string;

  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  plainItems: CreatePlainItemDto[];
}
