import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [AuthModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubsModule {}
