import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateActivityPerHourDto {
  @IsNotEmpty()
  @IsString()
  hour: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  workDayActivityId: number;
}
