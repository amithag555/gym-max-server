import { EnumMemberStatus, EnumRole, Member } from '@prisma/client';

export class MemberModel implements Member {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  address: string;
  phoneNumber: string;
  role: EnumRole;
  email: string;
  imgUrl: string;
  status: EnumMemberStatus;
  isActive: boolean;
  creationDate: Date;
  expiredDate: Date;
  isEntry: boolean;
  isFirstLogin: boolean;
}
