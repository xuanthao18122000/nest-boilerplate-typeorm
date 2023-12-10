import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerServiceProvider } from 'src/common/providers/logger.provider';
import { Employee } from 'src/database/entities';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [EmployeeService, LoggerServiceProvider],
})
export class EmployeeModule {}
