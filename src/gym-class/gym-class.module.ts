import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GymClassController } from './gym-class.controller';
import { GymClassService } from './gym-class.service';

@Module({
  imports: [AuthModule],
  controllers: [GymClassController],
  providers: [GymClassService],
})
export class GymClassModule {}
