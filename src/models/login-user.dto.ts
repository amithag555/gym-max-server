import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  password: string;
}
