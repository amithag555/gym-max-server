import { EnumMemberStatus } from '@prisma/client';

export class ThinMemberDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
  imgUrl: string;
  status: EnumMemberStatus;
  creationDate: Date;
  expiredDate: Date;
}
