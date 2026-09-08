import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles in the tenant' })
  findAll(@Req() req: any) {
    return this.rolesService.findAll(req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  create(@Req() req: any, @Body() body: { name: string; description?: string; permissions: string[] }) {
    return this.rolesService.create(req.user.tenantId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role and its permissions' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.rolesService.update(req.user.tenantId, id, body);
  }
}
