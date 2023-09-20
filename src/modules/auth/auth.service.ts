import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';
import { ErrorException } from 'src/common/response/error-payload.dto';
import statusCode from 'src/configs/status-code.config';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from 'src/common/utils/auth.utils';

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
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        statusCode['USER_NOT_FOUND'].code,
        statusCode['USER_NOT_FOUND'].type,
      );
    }

    if (user.status !== User.STATUS_USER.ACTIVE) {
      throw new ErrorException(
        HttpStatus.FORBIDDEN,
        statusCode['USER_INACTIVE'].code,
        statusCode['USER_INACTIVE'].type,
      );
    }

    const isAuth = comparePasswords(password, user.password);
    if (!isAuth) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        statusCode['WRONG_PASSWORD'].code,
        statusCode['WRONG_PASSWORD'].type,
      );
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
      throw new ErrorException(
        HttpStatus.CONFLICT,
        statusCode['USER_EXISTED'].code,
        statusCode['USER_EXISTED'].type,
      );
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
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });
    return {
      token,
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  }
}
