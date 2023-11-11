import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { SuccessSwaggerResponse } from 'src/common/utils';
import { User } from 'src/database/entities';

export class SignInDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export const SuccessAuthResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        user: {
          id: 1,
          email: 'admin@gmail.com',
          fullName: 'Admin',
          phoneNumber: '097392738',
          gender: 1,
          status: 1,
          roleId: 1,
          createdAt: '2023-10-08T04:04:04.434Z',
          updatedAt: '2023-11-11T12:09:35.075Z',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2OTk3MDQ1NzUsImV4cCI6MTY5OTc5MDk3NX0.HCxlekG9YFzeBydgjofEKAelBEJtR77G_7mFN14xCk8',
        expiresIn: '1d',
      },
      'Sign in user successful!',
    ),
  },
};

export const NotFoundAuthResponse = {
  description: 'User Not Found!',
  schema: {
    example: {
      code: 1001,
      success: false,
      type: 'USER_NOT_FOUND',
      msg: 'User not found!',
    },
  },
};

export const WrongPasswordAuthResponse = {
  code: 1002,
  success: false,
  type: 'WRONG_PASSWORD',
  msg: 'Your password is wrong!',
};

export class SignUpDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: User.GENDER_USER.MALE })
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  @IsNotEmpty()
  gender: number;
}

export class UpdateProfileDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: User.GENDER_USER.MALE })
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  @IsNotEmpty()
  gender: number;
}
