import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { MembersModule } from 'src/members/members.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ControlAuthGuard],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secretGymMax',
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),
    forwardRef(() => MembersModule),
    forwardRef(() => UsersModule),
  ],
  exports: [JwtStrategy, PassportModule, ControlAuthGuard],
})
export class AuthModule {}
