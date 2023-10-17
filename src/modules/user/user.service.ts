import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dto/user.dto';
import FilterBuilder from 'src/common/share/filter.service';
import { throwHttpException } from 'src/common/exceptions/throw.exception';
import { hashPassword } from 'src/common/utils/auth.utils';
import { listResponse } from 'src/common/response/response-list.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getAll(query: ListUserDto) {
    const { page = 1, perPage = 10 } = query;

    const filterBuilder = new FilterBuilder<User, ListUserDto>(
      this.userRepo,
      query,
    )
      .createQueryBuilder('users')
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
      .addUnAccentString('fullName')
      .addString('phoneNumber')
      .addNumber('gender')
      .addDate('createdAt', 'startDate', 'endDate')
      .sortBy('id');

    const [list, total] = await filterBuilder.queryBuilder.getManyAndCount();

    return listResponse(list, total, page, perPage);
  }

  async getOne(id: number): Promise<Partial<User>> {
    const user = await this.findUserByPk(id);

    if (!user) {
      throwHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user.serialize();
  }

  async create(body: CreateUserDto) {
    const { email, password, fullName, gender, phoneNumber } = body;
    const isExistUser = await this.userRepo.findOneBy({
      email,
    });

    if (isExistUser) {
      throwHttpException(HttpStatus.CONFLICT, 'USER_EXISTED');
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
      throwHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }
}
