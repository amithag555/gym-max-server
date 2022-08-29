import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from 'src/members/member.service';
import { MemberModel } from 'src/members/models/member.model';
import { CreateMemberDto } from 'src/models/create-member.dto';
import { CreateUserDto } from 'src/models/create-user.dto';
import { LoginMemberDto } from 'src/models/login-member.dto';
import { LoginUserDto } from 'src/models/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerMember(newMember: CreateMemberDto): Promise<MemberModel> {
    return await this.memberService.createMember(newMember);
  }

  async registerUser(newUser: CreateUserDto): Promise<UserModel> {
    return await this.userService.createUser(newUser);
  }

  async loginMember(
    memberDetails: LoginMemberDto,
  ): Promise<{ accessToken: string }> {
    const returnedMember = await this.memberService.validateMemberLoginDetails(
      memberDetails,
    );

    const payload: JwtPayload = {
      id: returnedMember.id,
      role: returnedMember.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'secretGymMax',
    });

    return { accessToken };
  }

  async loginUser(userDetails: LoginUserDto): Promise<{ accessToken: string }> {
    const returnedUser = await this.userService.validateUserLoginDetails(
      userDetails,
    );

    const payload: JwtPayload = {
      id: returnedUser.id,
      role: returnedUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
