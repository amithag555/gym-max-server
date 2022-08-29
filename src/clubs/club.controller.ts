import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { ClubService } from './club.service';
import { ClubModel } from './models/club.model';

@Controller('clubs')
@UseGuards(ControlAuthGuard)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get(':id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER, EnumRole.MEMBER)
  async getClubById(@Param('id', ParseIntPipe) id: number): Promise<ClubModel> {
    return this.clubService.getClubById(id);
  }

  @Put('/increment/:id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER, EnumRole.MEMBER)
  async incrementClubCountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClubModel> {
    return this.clubService.incrementClubCountById(id);
  }

  @Put('/decrement/:id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER, EnumRole.MEMBER)
  async decrementClubCountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClubModel> {
    return this.clubService.decrementClubCountById(id);
  }

  @Put('/reset/:id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER, EnumRole.MEMBER)
  async resetClubCountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClubModel> {
    return this.clubService.resetClubCountById(id);
  }
}
