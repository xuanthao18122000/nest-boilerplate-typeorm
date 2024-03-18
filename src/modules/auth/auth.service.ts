import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { IAzureExpressUser } from 'src/common/interfaces';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { getEnv } from 'src/submodules/configs/env.config';
import { User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  FireBaseDto,
  SignInDto,
  SignUpDto,
  UpdateProfileDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async signIn(body: SignInDto) {
    const { email } = body;

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    if (user.status !== User.STATUS.ACTIVE) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_INACTIVE');
    }

    const jwt = await this.signToken(user.id, user.email);

    user.token = jwt.token;
    const updatedUser = await this.userRepo.save(user);
    const permissions = _.map(user.actions, 'action');

    return {
      user: {
        ...updatedUser.serialize(),
        permissions,
      },
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    };
  }

  async signInAzure(body: IAzureExpressUser) {
    const email = body.preferred_username;
    const microsoftId = body.oid;

    const user = await this.findUserByEmail(email);

    if (!user || (user.microsoftId && user.microsoftId !== microsoftId)) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    if (user.status !== User.STATUS.ACTIVE) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_INACTIVE');
    }

    const jwt = await this.signToken(user.id, user.email);

    if (!user.microsoftId) {
      user.microsoftId = microsoftId;
    }

    user.token = jwt.token;

    const updatedUser = await this.userRepo.save(user);
    const permissions = _.map(user.actions, 'action');

    return {
      user: {
        ...updatedUser.serialize(),
        permissions,
      },
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    };
  }

  async signUp(body: SignUpDto): Promise<User> {
    const { email, fullName, phoneNumber } = body;

    const userExisted = await this.userRepo.findOneBy({ email });

    if (userExisted) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'USER_EXISTED');
    }

    const user = this.userRepo.create({
      email,
      status: User.STATUS.ACTIVE,
      fullName,
      phoneNumber,
    });

    return await this.userRepo.save(user);
  }

  async signOut(user: User): Promise<User> {
    user.token = null;
    return await this.userRepo.save(user);
  }

  async getProfile(id: number) {
    return await this.findUserRelation(id);
  }

  async updateProfile(body: UpdateProfileDto, id: number): Promise<User> {
    const { fullName, phoneNumber, address, avatar } = body;
    const user = await this.findUserRelation(id);

    if (avatar) user.avatar = avatar;
    if (address) user.address = address;
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    return await this.userRepo.save(user);
  }

  async findUserRelation(id: number): Promise<User> {
    const select = [
      'user.id',
      'user.email',
      'user.fullName',
      'user.phoneNumber',
      'user.rouId',
      'user.roleId',
      'user.lang',
      'user.avatar',
      'user.address',
      'user.provinceId',
      'user.status',
      'user.updatedAt',
      'user.createdAt',
      'rou.id',
      'rou.name',
      'role.id',
      'role.name',
    ];
    return await this.userRepo
      .createQueryBuilder('user')
      .select(select)
      .leftJoin('user.rou', 'rou')
      .leftJoin('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<{
    token: string;
    expiresIn: string;
  }> {
    const payload = {
      id: id,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: getEnv('JWT_EXPIRES_IN'),
      secret: getEnv('JWT_SECRET'),
    });
    return {
      token,
      expiresIn: getEnv('JWT_EXPIRES_IN'),
    };
  }

  async registerFirebase(
    { firebaseToken }: FireBaseDto,
    userId: number,
  ): Promise<User> {
    const user = await this.findUserByPk(userId);

    user.firebaseToken = firebaseToken;
    return await this.userRepo.save(user);
  }

  async logoutFirebase(userId: number): Promise<User> {
    const user = await this.findUserByPk(userId);

    user.firebaseToken = null;
    return await this.userRepo.save(user);
  }

  private async findUserByPk(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    return user;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.actions', 'actions')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    return user;
  }
}
