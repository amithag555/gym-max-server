import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class CreateWorkoutGoalDto {
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  trainingNumber: number;

  @IsNotEmpty()
  @IsNumber()
  memberId: number;
}
