import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  context: string;
}
