import { Body, Controller, HttpException, Post } from '@nestjs/common';
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
    try {
      return await this.authService.registerMember(newMember);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Post('/user')
  async registerUser(@Body() newUser: CreateUserDto): Promise<UserModel> {
    try {
      return await this.authService.registerUser(newUser);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Post('/memberLogin')
  async loginMember(
    @Body() memberDetails: LoginMemberDto,
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.loginMember(memberDetails);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  @Post('/userLogin')
  async loginUser(
    @Body() userDetails: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.loginUser(userDetails);
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
