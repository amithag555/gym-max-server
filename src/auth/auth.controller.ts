import { Body, Controller, Post } from '@nestjs/common';
import { MemberModel } from 'src/members/models/member.model';
import { CreateMemberDto } from 'src/models/create-member.dto';
import { CreateUserDto } from 'src/models/create-user.dto';
import { LoginMemberDto } from 'src/models/login-member.dto';
import { LoginUserDto } from 'src/models/login-user.dto';
import { UserModel } from 'src/users/models/user.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/member')
  async registerMember(
    @Body() newMember: CreateMemberDto,
  ): Promise<MemberModel> {
    return await this.authService.registerMember(newMember);
  }

  @Post('/user')
  async registerUser(@Body() newUser: CreateUserDto): Promise<UserModel> {
    return await this.authService.registerUser(newUser);
  }

  @Post('/memberLogin')
  async loginMember(
    @Body() memberDetails: LoginMemberDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.loginMember(memberDetails);
  }

  @Post('/userLogin')
  async loginUser(
    @Body() userDetails: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.loginUser(userDetails);
  }
}
