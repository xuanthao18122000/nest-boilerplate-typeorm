import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { ListUserDto } from './dto/user.dto';
import FilterBuilder from 'src/common/share/filter.service';
import { throwHttpException } from 'src/common/exceptions/throw.exception';
import { hashPassword } from 'src/common/utils/auth.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getAll(query: ListUserDto) {
    const { page = 1, perPage = 10 } = query;

    const filterBuilder = new FilterBuilder<User>(this.userRepo, query)
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

    return { list, total, page: Number(page), perPage: Number(perPage) };
  }

  async getOne(id: number): Promise<User | any> {
    const user = await this.findUserByPk(id);

    if (!user) {
      throwHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user.serialize();
  }

  async create(body: any) {
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
      throwHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }
}
