import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditTrainingPlanDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  trainerName: string;
}
