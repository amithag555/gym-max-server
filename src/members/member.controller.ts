import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthorizeContext } from 'src/decorators/authorize-context.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ControlAuthGuard } from 'src/guards/control-auth.guard';
import { CreateMemberDto } from 'src/models/create-member.dto';
import { UpdatePasswordDto } from 'src/models/update-password.dto';
import { EditMemberDto } from './dto/edit-member.dto';
import { RetrieveMemberDto } from './dto/retrieve-member.dto';
import { MemberService } from './member.service';
import { MemberModel } from './models/member.model';

@Controller('members')
@UseGuards(ControlAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER)
  async getAllMembers(): Promise<RetrieveMemberDto[]> {
    return await this.memberService.getAllMembers();
  }

  @Get('/membersCount')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getMembersCount(): Promise<number> {
    return await this.memberService.getMembersCount();
  }

  @Get('/searchMembersCount')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getSearchMembersCount(@Query('q') searchText: string): Promise<number> {
    return await this.memberService.getSearchMembersCount(searchText);
  }

  @Get('/byPage')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getMembersByPageNumberAndPerPage(
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
  ): Promise<MemberModel[]> {
    return await this.memberService.getMembersByPageNumberAndPerPage(
      pageNumber,
      perPageNumber,
    );
  }

  @Get('/byToken')
  @Roles(EnumRole.MEMBER)
  async getMemberByTokenEmail(
    @GetUser() member: MemberModel,
  ): Promise<MemberModel> {
    return await this.memberService.getMemberByTokenEmail(member);
  }

  @Get('/search')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async getMembersByNameOrPhoneNumber(
    @Query('page', ParseIntPipe) pageNumber: number,
    @Query('perPage', ParseIntPipe) perPageNumber: number,
    @Query('q') searchText: string,
  ): Promise<MemberModel[]> {
    return await this.memberService.getMembersByNameOrPhoneNumber(
      pageNumber,
      perPageNumber,
      searchText,
    );
  }

  @Get('/:id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.MEMBER)
  @AuthorizeContext(AuthorizableOriginParameter.MemberId)
  async getMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberModel> {
    return await this.memberService.getMemberById(id);
  }

  @Put('/password')
  @Roles(EnumRole.MEMBER)
  async updatePassword(
    @GetUser() member: MemberModel,
    @Body() newPassword: UpdatePasswordDto,
  ): Promise<MemberModel> {
    return await this.memberService.updatePassword(member.id, newPassword);
  }

  @Put('/imgUrl/:id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.MEMBER)
  async updateImgUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body('imgUrl') imgUrl: string,
  ): Promise<MemberModel> {
    return await this.memberService.updateImgUrl(imgUrl, id);
  }

  @Put('/isEntry')
  @Roles(EnumRole.MEMBER)
  async changeIsEntry(@GetUser() member: MemberModel): Promise<MemberModel> {
    return await this.memberService.changeIsEntry(member.id, member.isEntry);
  }

  @Put('/isFirstLogin')
  @Roles(EnumRole.MEMBER)
  async changeIsFirstLogin(
    @GetUser() member: MemberModel,
  ): Promise<MemberModel> {
    return await this.memberService.changeIsFirstLogin(member.id);
  }

  @Put(':id')
  @Roles(EnumRole.ADMIN, EnumRole.RECEPTION)
  async editMemberById(
    @Param('id', ParseIntPipe) id: number,
    @Body() memberToEdit: EditMemberDto,
  ): Promise<MemberModel> {
    return await this.memberService.editMemberById(id, memberToEdit);
  }

  @Put('delete/:id')
  @Roles(EnumRole.ADMIN)
  async deleteMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberModel> {
    return await this.memberService.deleteMemberById(id);
  }

  @Post()
  @Roles(EnumRole.ADMIN)
  async createMember(@Body() newMember: CreateMemberDto): Promise<MemberModel> {
    return await this.memberService.createMember(newMember);
  }
}
