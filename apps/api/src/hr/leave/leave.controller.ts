import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeaveService } from './leave.service';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('hr/leave-requests')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  @ApiOperation({ summary: 'List leave requests' })
  findAll(@Req() req: any, @Query('employee_id') employeeId?: string) {
    return this.leaveService.findAll(req.user.tenantId, employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a leave request' })
  create(@Req() req: any, @Body() body: any) {
    return this.leaveService.create(req.user.tenantId, body);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a leave request' })
  approve(@Req() req: any, @Param('id') id: string) {
    return this.leaveService.approve(req.user.tenantId, id, req.user.userId);
  }
}
