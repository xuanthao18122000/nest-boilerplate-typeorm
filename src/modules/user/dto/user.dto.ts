import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { PaginationOptions } from 'src/common/builder/custom-base.filter';
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
