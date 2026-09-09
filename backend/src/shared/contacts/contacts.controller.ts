import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';

@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List all contacts (unified party search)' })
  findAll(@Req() req: any, @Query('type') type?: string) {
    return this.contactsService.findAll(req.user.tenantId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  create(@Req() req: any, @Body() body: any) {
    return this.contactsService.create(req.user.tenantId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.contactsService.update(req.user.tenantId, id, body);
  }
}
