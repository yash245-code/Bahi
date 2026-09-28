import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('hr/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List all employees' })
  findAll(@Req() req: any) { return this.employeesService.findAll(req.user.tenantId); }

  @Post()
  @ApiOperation({ summary: 'Create an employee record' })
  create(@Req() req: any, @Body() body: any) { return this.employeesService.create(req.user.tenantId, body); }
}
