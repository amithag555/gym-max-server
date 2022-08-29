import { EnumMemberStatus } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditMemberDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsIn([
    EnumMemberStatus.ACTIVE,
    EnumMemberStatus.CANCELLED,
    EnumMemberStatus.SUSPEND,
  ])
  status: EnumMemberStatus;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  creationDate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  expiredDate: string;
}
