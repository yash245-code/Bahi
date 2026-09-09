import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users in the tenant' })
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.usersService.findOne(req.user.tenantId, id);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite a new user to the tenant' })
  invite(@Req() req: any, @Body() body: { email: string; firstName: string; lastName: string; roleId?: string }) {
    return this.usersService.invite(req.user.tenantId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.usersService.update(req.user.tenantId, id, body);
  }
}
