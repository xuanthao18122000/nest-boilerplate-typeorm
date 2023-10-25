import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from 'src/common/utils/auth.utils';
import { throwHttpException } from 'src/common/exceptions/throw.exception';
import { getEnv } from 'src/configs/env.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throwHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    if (user.status !== User.STATUS_USER.ACTIVE) {
      throwHttpException(HttpStatus.UNAUTHORIZED, 'USER_INACTIVE');
    }

    const isAuth = comparePasswords(password, user.password);
    if (!isAuth) {
      throwHttpException(HttpStatus.NOT_FOUND, 'WRONG_PASSWORD');
    }
    const jwt = await this.signToken(user.id, user.email);

    user.token = jwt.token;
    const updatedUser = await this.userRepo.save(user);

    return {
      user: updatedUser.serialize(),
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    };
  }

  async signUp(body: SignUpDto) {
    const { email, password, fullName, phoneNumber, gender } = body;

    const userExisted = await this.userRepo.findOneBy({ email });

    if (userExisted) {
      throwHttpException(HttpStatus.CONFLICT, 'USER_EXISTED');
    }

    const user = this.userRepo.create({
      email,
      password: hashPassword(password),
      status: User.STATUS_USER.ACTIVE,
      fullName,
      phoneNumber,
      gender,
    });

    return await this.userRepo.save(user);
  }

  async signOut(user: User) {
    user.token = null;
    return await this.userRepo.save(user);
  }

  async updateProfile(body: UpdateProfileDto, user: User): Promise<User> {
    const { fullName, phoneNumber, gender } = body;

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (gender) user.gender = gender;

    return await this.userRepo.save(user);
  }

  async signToken(id: number, email: string) {
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
}
