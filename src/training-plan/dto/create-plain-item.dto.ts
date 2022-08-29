import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { CreateExerciseDto } from './create-exercise.dto';

export class CreatePlainItemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  muscleName: string;

  @IsNotEmpty()
  exercises: CreateExerciseDto[];

  @Optional()
  @IsNumber()
  trainingPlanId: number;
}
