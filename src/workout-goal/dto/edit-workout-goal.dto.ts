import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class EditWorkoutGoalDto {
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  trainingNumber: number;
}
