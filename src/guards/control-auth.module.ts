import { Module } from '@nestjs/common';
import { ControlAuthGuard } from './control-auth.guard';

@Module({
  providers: [ControlAuthGuard],
  exports: [ControlAuthGuard],
})
export class ControlAuthModule {}
