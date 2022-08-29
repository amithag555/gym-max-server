import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginMemberDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  password: string;
}
