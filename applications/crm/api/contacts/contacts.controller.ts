// ═══════════════════════════════════════════════════════════
// ContactsController — Customer Contacts REST Endpoints
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { ContactsService, CreateContactDto } from './contacts.service';

@ApiTags('crm-contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List contacts with company and owner attribution' })
  findAll(
    @Req() req: any,
    @Query('companyId') companyId?: string,
    @Query('lifecycleStage') lifecycleStage?: string,
    @Query('ownerId') ownerId?: string,
    @Query('search') search?: string,
  ) {
    return this.contactsService.findAll(req.user.tenantId, {
      companyId,
      lifecycleStage,
      ownerId,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact 360 view with timeline, deals, and notes' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  create(@Req() req: any, @Body() body: CreateContactDto) {
    return this.contactsService.create(req.user.tenantId, body, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact details' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<CreateContactDto>,
  ) {
    return this.contactsService.update(req.user.tenantId, id, body, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete contact' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.remove(req.user.tenantId, id, req.user.id);
  }
}
