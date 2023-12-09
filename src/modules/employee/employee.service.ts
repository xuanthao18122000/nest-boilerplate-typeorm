import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/common/builder/filter.builder';
import { ErrorHttpException } from 'src/common/exceptions/throw.exception';
import { listResponse } from 'src/common/response/response-list.response';
import { hashPassword } from 'src/common/utils';
import { Employee } from 'src/database/entities';
import { Repository } from 'typeorm';
import {
  CreateEmployeeDto,
  ListEmployeeDto,
  UpdateEmployeeDto,
} from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async getAll(query: ListEmployeeDto) {
    const { page = 1, perPage = 10 } = query;
    const entity = {
      entityRepo: this.employeeRepo,
      alias: 'employee',
    };

    const filterBuilder = new FilterBuilder<Employee, ListEmployeeDto>(
      entity,
      query,
    )
      .select([
        'id',
        'email',
        'fullName',
        'phoneNumber',
        'gender',
        'avatar',
        'createdAt',
        'updatedAt',
      ])
      .addLeftJoinAndSelect(['id', 'name'], 'role')
      .addUnAccentString('fullName')
      .addString('phoneNumber')
      .addNumber('gender')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();

    return listResponse(list, total, page, perPage);
  }

  async getOne(id: number): Promise<Partial<Employee>> {
    const employee = await this.findEmployeeByPk(id);

    if (!employee) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'EMPLOYEE_NOT_FOUND');
    }
    return employee.serialize();
  }

  async create(body: CreateEmployeeDto) {
    const { email, password, fullName, gender, phoneNumber } = body;
    const isExistEmployee = await this.employeeRepo.findOneBy({
      email,
    });

    if (isExistEmployee) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'EMPLOYEE_EXISTED');
    }

    const employee = this.employeeRepo.create({
      email,
      password: hashPassword(password),
      phoneNumber,
      status: 1,
      fullName,
      gender,
    });

    return await this.employeeRepo.save(employee);
  }

  async update(
    id: number,
    { fullName, phoneNumber, gender, address }: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findEmployeeByPk(id);

    if (fullName) employee.fullName = fullName;
    if (phoneNumber) employee.phoneNumber = phoneNumber;
    if (gender) employee.gender = gender;
    if (address) employee.address = address;

    return await this.employeeRepo.save(employee);
  }

  async findEmployeeByPk(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOneBy({ id });
    if (!employee) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'EMPLOYEE_NOT_FOUND');
    }
    return employee;
  }
}
