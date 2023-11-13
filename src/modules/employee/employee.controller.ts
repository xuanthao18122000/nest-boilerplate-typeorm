import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SendResponse } from 'src/common/response/send-response';
import {
  CreateEmployeeDto,
  ListEmployeeDto,
  UpdateEmployeeDto,
} from './dto/employee.dto';
import { EmployeeService } from './employee.service';
import {
  ExistedCreateEmployeeResponse,
  NotFoundDetailEmployeeResponse,
  SuccessCreateEmployeeResponse,
  SuccessDetailEmployeeResponse,
  SuccessListEmployeeResponse,
  SuccessUpdateEmployeeResponse,
} from './response';

@ApiBearerAuth()
@ApiTags('5. Employees')
@Controller('employees')
@UsePipes(new ValidationPipe({ transform: true }))
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhân viên' })
  @ApiOkResponse(SuccessCreateEmployeeResponse)
  @ApiConflictResponse(ExistedCreateEmployeeResponse)
  async createEmployee(@Body() body: CreateEmployeeDto) {
    const employee = await this.employeeService.create(body);
    return SendResponse.success(
      employee.serialize(),
      'Create employee successful!',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  @ApiOkResponse(SuccessListEmployeeResponse)
  async getAll(@Query() query: ListEmployeeDto) {
    const employees = await this.employeeService.getAll(query);
    return SendResponse.success(employees, 'Get all employees successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  @ApiOkResponse(SuccessDetailEmployeeResponse)
  @ApiNotFoundResponse(NotFoundDetailEmployeeResponse)
  async getOneEmployee(@Param('id') id: number) {
    const employee = await this.employeeService.getOne(id);
    return SendResponse.success(employee, 'Get detail employee successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật nhân viên' })
  @ApiOkResponse(SuccessUpdateEmployeeResponse)
  @ApiNotFoundResponse(NotFoundDetailEmployeeResponse)
  async updateEmployee(
    @Param('id') id: number,
    @Body() body: UpdateEmployeeDto,
  ) {
    const employee = await this.employeeService.update(id, body);
    return SendResponse.success(
      employee.serialize(),
      'Update employee successful!',
    );
  }
}
