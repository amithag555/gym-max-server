import { Module } from '@nestjs/common';
import { MemberEntryProcessGateway } from './member-entry-process.gateway';

@Module({
  providers: [MemberEntryProcessGateway],
})
export class MemberEntryProcessModule {}
