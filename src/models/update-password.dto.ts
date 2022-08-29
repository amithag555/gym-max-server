import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  password: string;
}
