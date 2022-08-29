import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  currentMembersCount: number;
}
