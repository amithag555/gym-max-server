import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateActivityPerHourDto {
  @IsNotEmpty()
  @IsNumber()
  hour: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  workDayActivityId: number;
}
