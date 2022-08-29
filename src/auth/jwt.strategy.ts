import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { MemberService } from 'src/members/member.service';
import { MemberModel } from 'src/members/models/member.model';
import { UserModel } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private memberService: MemberService,
    private userService: UsersService,
  ) {
    super({
      secretOrKey: 'secretGymMax',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { id, role } = payload;

    let user: UserModel;
    let member: MemberModel;

    if (role == 'MEMBER') {
      member = await this.memberService.getMemberById(id);
    } else {
      user = await this.userService.getUserById(id);
    }

    if (!user && !member) {
      throw new UnauthorizedException();
    }

    if (member) {
      return member;
    }

    return user;
  }
}
