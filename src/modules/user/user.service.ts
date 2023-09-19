import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorException } from 'src/common/response/error-payload.dto';
import statusCode from 'src/configs/status-code.config';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import FilterBuilderService from 'src/common/filter-builder/filter-builder.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private _filterBuilder: FilterBuilderService,
  ) {}

  async getAll(query: any): Promise<any> {
    const { page = 1, perPage = 10 } = query;

    query.filter = {
      selectFields: [
        'id',
        'fullName',
        'email',
        'avatar',
        'phoneNumber',
        'gender',
        'address',
        'status',
        'createdAt',
        'updatedAt',
      ],
      unaccentFields: ['fullName'],
      numberFields: [],
      stringFields: ['phoneNumber'],
      dateFields: {
        dateName: 'createdAt',
        startDateField: 'startDate',
        endDateField: 'endDate',
      },
      sortName: 'Id',
    };

    const entityName = 'users';
    const queryBuilder = this.userRepo.createQueryBuilder(entityName);
    const users = this._filterBuilder.buildQuery(
      User,
      entityName,
      queryBuilder,
      query,
    );

    const [list, total] = await users.getManyAndCount();

    return { list, total, page: Number(page) / 1, perPage: perPage / 1 };
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
