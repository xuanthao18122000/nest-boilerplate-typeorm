import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/common/builder/pagination-options.builder';
import { SuccessSwaggerResponse } from 'src/common/utils';
import { User } from 'src/database/entities';

export class ListUserDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'Họ tên' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, description: 'Số điện thoại' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    required: false,
    description: 'Giới tính',
    enum: User.GENDER_USER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  gender: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Ngày tạo từ. Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Ngày tạo đến.Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;

  // @ApiProperty({
  //   required: false,
  //   type: Boolean,
  //   description: 'Tải file excel',
  // })
  // @Transform(({ value }) => value === 'true')
  // @IsBoolean()
  // @IsOptional()
  // download?: boolean;
}

export class CreateUserDto {
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

export class UpdateUserDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, example: User.GENDER_USER.MALE })
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  @IsOptional()
  gender: number;
}

export const SuccessUsersResponse = {
  status: 200,
  description: 'Success!',
  content: {},
  schema: {
    example: SuccessSwaggerResponse(
      {
        list: [
          {
            id: 1,
            createdAt: '2023-10-08T04:04:04.434Z',
            updatedAt: '2023-11-11T12:09:35.075Z',
            email: 'admin@gmail.com',
            fullName: 'Admin',
            phoneNumber: '097392738',
            gender: 1,
            avatar: 'avatar.png',
            role: 1,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
      },
      'Get all users successful!',
    ),
  },
};

export const SuccessUserResponse = {
  status: 200,
  description: 'Success!',
  content: {},
  schema: {
    example: SuccessSwaggerResponse(
      {
        id: 1,
        email: 'admin@gmail.com',
        fullName: 'Admin',
        phoneNumber: '097392738',
        gender: 1,
        status: 1,
        roleId: null,
        createdAt: '2023-10-08T04:04:04.434Z',
        updatedAt: '2023-11-11T12:09:35.075Z',
      },
      'Get detail user successful!',
    ),
  },
};

export const NotFoundUserResponse = {
  status: 404,
  description: 'Not Found User!',
  content: {},
  schema: {
    example: {
      code: 1001,
      success: false,
      type: 'USER_NOT_FOUND',
      msg: 'User not found!',
    },
  },
};
