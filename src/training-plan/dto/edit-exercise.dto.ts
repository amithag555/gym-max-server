import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditExerciseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  setsNumber: number;

  @IsNotEmpty()
  @IsNumber()
  repetitionsNumber: number;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  machineNumber: string;

  @IsOptional()
  @IsNumber()
  weight: number;
}
