import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMemberDto } from 'src/models/create-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberModel } from './models/member.model';
import { LoginMemberDto } from 'src/models/login-member.dto';
import { compare, hash } from 'bcrypt';
import { EditMemberDto } from './dto/edit-member.dto';
import { UpdatePasswordDto } from 'src/models/update-password.dto';
import { RetrieveMemberDto } from './dto/retrieve-member.dto';
import { EnumMemberStatus } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getAllMembers(): Promise<RetrieveMemberDto[]> {
    try {
      return await this.prisma.member.findMany({
        where: {
          isActive: true,
          status: EnumMemberStatus.ACTIVE || EnumMemberStatus.SUSPEND,
        },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
        orderBy: {
          fullName: 'asc',
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getMembersByPageNumberAndPerPage(
    pageNumber: number,
    perPageNumber: number,
  ): Promise<MemberModel[]> {
    try {
      return await this.prisma.member.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        where: {
          isActive: true,
        },
        orderBy: {
          firstName: 'asc',
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getMembersCount(): Promise<number> {
    try {
      return await this.prisma.member.count({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getSearchMembersCount(searchText: string): Promise<number> {
    try {
      return await this.prisma.member.count({
        where: {
          isActive: true,
          OR: [
            {
              firstName: {
                contains: searchText,
              },
            },
            {
              lastName: {
                contains: searchText,
              },
            },
            {
              fullName: {
                contains: searchText,
              },
            },
            {
              phoneNumber: {
                contains: searchText,
              },
            },
          ],
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getMemberByTokenEmail(member: MemberModel): Promise<MemberModel> {
    try {
      const returnedMember = await this.prisma.member.findUnique({
        where: {
          email: member.email,
        },
      });

      if (!returnedMember) {
        throw new NotFoundException(`Member not found!`);
      }

      returnedMember.password = '*****';
      return returnedMember;
    } catch (error) {
      return error;
    }
  }

  async getMemberById(id: number): Promise<MemberModel> {
    try {
      const returnedMember = await this.prisma.member.findUnique({
        where: {
          id: id,
        },
      });

      if (!returnedMember) {
        throw new NotFoundException(`Member not found!`);
      }

      returnedMember.password = '*****';
      return returnedMember;
    } catch (error) {
      return error;
    }
  }

  async getMembersByNameOrPhoneNumber(
    pageNumber: number,
    perPageNumber: number,
    searchText: string,
  ): Promise<MemberModel[]> {
    try {
      return await this.prisma.member.findMany({
        skip: (pageNumber - 1) * perPageNumber,
        take: perPageNumber,
        where: {
          isActive: true,
          OR: [
            {
              firstName: {
                contains: searchText,
              },
            },
            {
              lastName: {
                contains: searchText,
              },
            },
            {
              fullName: {
                contains: searchText,
              },
            },
            {
              phoneNumber: {
                contains: searchText,
              },
            },
          ],
        },
        orderBy: {
          firstName: 'asc',
        },
      });
    } catch (error) {
      return error.response;
    }
  }

  async editMemberById(
    id: number,
    memberToEdit: EditMemberDto,
  ): Promise<MemberModel> {
    try {
      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          ...memberToEdit,
          fullName: `${memberToEdit.firstName} ${memberToEdit.lastName}`,
          creationDate: new Date(memberToEdit.creationDate),
          expiredDate: new Date(memberToEdit.expiredDate),
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      } else {
        return error;
      }
    }
  }

  async updatePassword(
    id: number,
    newPassword: UpdatePasswordDto,
  ): Promise<MemberModel> {
    try {
      newPassword.password = await hash(newPassword.password, 10);

      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          password: newPassword.password,
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      return error;
    }
  }

  async createMember(newMember: CreateMemberDto): Promise<MemberModel> {
    try {
      const newMemberPassword = await hash('0000', 10);

      const newMemberReturned = await this.prisma.member.create({
        data: {
          ...newMember,
          fullName: `${newMember.firstName} ${newMember.lastName}`,
          expiredDate: new Date(newMember.expiredDate),
          creationDate: new Date(newMember.creationDate),
          password: newMemberPassword,
        },
      });

      newMemberReturned.password = '*****';
      return newMemberReturned;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      } else {
        return error;
      }
    }
  }

  async deleteMemberById(id: number): Promise<MemberModel> {
    try {
      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          isActive: false,
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      return error;
    }
  }

  async changeIsEntry(id: number, isEntry: boolean): Promise<MemberModel> {
    try {
      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          isEntry: !isEntry,
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      return error;
    }
  }

  async changeIsFirstLogin(id: number): Promise<MemberModel> {
    try {
      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          isFirstLogin: false,
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      return error;
    }
  }

  async updateImgUrl(imgUrl: string, id: number): Promise<MemberModel> {
    try {
      const memberReturned = await this.prisma.member.update({
        where: {
          id: id,
        },
        data: {
          imgUrl: imgUrl,
        },
      });

      memberReturned.password = '*****';
      return memberReturned;
    } catch (error) {
      return error;
    }
  }

  async validateMemberLoginDetails(
    memberDetails: LoginMemberDto,
  ): Promise<MemberModel> {
    const returnedMember = await this.prisma.member.findUnique({
      where: {
        email: memberDetails.email,
      },
    });

    if (!returnedMember) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validatePassword = await compare(
      memberDetails.password,
      returnedMember.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return returnedMember;
  }
}
