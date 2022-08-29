import { Test, TestingModule } from '@nestjs/testing';
import { MemberEntryProcessGateway } from './member-entry-process.gateway';

describe('MemberEntryProcessGateway', () => {
  let gateway: MemberEntryProcessGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberEntryProcessGateway],
    }).compile();

    gateway = module.get<MemberEntryProcessGateway>(MemberEntryProcessGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
