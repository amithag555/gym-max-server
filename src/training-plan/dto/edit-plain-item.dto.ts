import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EditPlainItemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  muscleName: string;
}
