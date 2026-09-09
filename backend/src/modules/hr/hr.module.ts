import { Module } from '@nestjs/common';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';
import { LeaveController } from './leave/leave.controller';
import { LeaveService } from './leave/leave.service';

@Module({
  controllers: [EmployeesController, LeaveController],
  providers: [EmployeesService, LeaveService],
  exports: [EmployeesService, LeaveService],
})
export class HrModule {}
