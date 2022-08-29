import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MembersModule {}
