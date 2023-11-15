import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import FilterBuilder from 'src/common/builder/filter.builder';
import { ErrorHttpException } from 'src/common/exceptions/throw.exception';
import { listResponse } from 'src/common/response/response-list.response';
import { hashPassword } from 'src/common/utils';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getAll(query: ListUserDto) {
    const { page = 1, perPage = 10 } = query;
    const entity = {
      entityRepo: this.userRepo,
      alias: 'user',
    };

    const filterBuilder = new FilterBuilder<User, ListUserDto>(entity, query)
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

    const [list, total] = await filterBuilder.queryBuilder.getManyAndCount();

    return listResponse(list, total, page, perPage);
  }

  async exportUsers(users: User[]) {
    console.log(users);
    const workbook = new ExcelJS.Workbook();
    return workbook.xlsx.writeBuffer();
  }

  async getOne(id: number): Promise<Partial<User>> {
    const user = await this.findUserByPk(id);

    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user.serialize();
  }

  async create(body: CreateUserDto) {
    const { email, password, fullName, gender, phoneNumber } = body;
    const isExistUser = await this.userRepo.findOneBy({
      email,
    });

    if (isExistUser) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'USER_EXISTED');
    }

    const user = this.userRepo.create({
      email,
      password: hashPassword(password),
      phoneNumber,
      status: 1,
      fullName,
      gender,
    });

    return await this.userRepo.save(user);
  }

  async update(
    id: number,
    { fullName, phoneNumber, gender, address }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserByPk(id);

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (gender) user.gender = gender;
    if (address) user.address = address;

    return await this.userRepo.save(user);
  }

  async findUserByPk(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }

  async transaction() {
    // const queryRunner = await this.transactionBuilder.startTransaction();
    // try {
    //   const user = new User({});
    //   await queryRunner.manager.save(user);
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   throw throw ErrorHttpException(
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //     'ERROR_IMPORT_DATA',
    //   );
    // } finally {
    //   await queryRunner.release();
    // }
  }
}
