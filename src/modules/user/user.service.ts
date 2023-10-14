import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorException } from 'src/common/response/error-payload.dto';
import statusCode from 'src/configs/status-code.config';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import FilterBuilderService from 'src/common/filter-builder/filter-builder.service';
import { ListUserDto } from './dto/user.dto';
import { FindAllResponse } from 'src/common/types/common.type';
import FilterBuilder from 'src/common/share/filter.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private _filterBuilderService: FilterBuilderService,
  ) {}

  // query.filter = {
  //   selectFields: [
  //     'id',
  //     'fullName',
  //     'email',
  //     'avatar',
  //     'phoneNumber',
  //     'gender',
  //     'address',
  //     'status',
  //     'createdAt',
  //     'updatedAt',
  //   ],
  //   unaccentFields: ['fullName'],
  //   numberFields: [],
  //   stringFields: ['phoneNumber'],
  //   dateFields: {
  //     dateName: 'createdAt',
  //     startDateField: 'startDate',
  //     endDateField: 'endDate',
  //   },
  //   sortName: 'Id',
  // };
  async getAll(query: ListUserDto) {
    const { page = 1, perPage = 10 } = query;

    const filterBuilder = new FilterBuilder<User>(query, this.userRepo)
      .createQueryBuilder('users')
      .addUnAccentString('fullName')
      .addNumber('gender');

    const [list, total] = await filterBuilder.queryBuilder.getManyAndCount();

    return { list, total, page: Number(page), perPage: Number(perPage) };
  }

  async getOne(id: number): Promise<User | any> {
    const user = await this.findUserByPk(id);

    if (!user) {
      throw new ErrorException(
        HttpStatus.CONFLICT,
        statusCode['USER_NOT_FOUND'].code,
        statusCode['USER_NOT_FOUND'].type,
      );
    }
    return user.serialize();
  }

  async create(body: any) {
    const { email, password, fullName, gender, phoneNumber } = body;
    const isExistUser = await this.userRepo.findOneBy({
      email,
    });

    if (isExistUser) {
      throw new ErrorException(
        HttpStatus.CONFLICT,
        statusCode['USER_EXISTED'].code,
        statusCode['USER_EXISTED'].type,
      );
    }

    const user = this.userRepo.create({
      email,
      password: this.hashPassword(password),
      phoneNumber,
      status: 1,
      fullName,
      gender,
    });

    return await this.userRepo.save(user);
  }

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  async update(id: number, body: any): Promise<User> {
    const { fullName, phoneNumber, gender, address } = body;
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
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        statusCode['USER_NOT_FOUND'].code,
        statusCode['USER_NOT_FOUND'].type,
      );
    }
    return user;
  }
}
