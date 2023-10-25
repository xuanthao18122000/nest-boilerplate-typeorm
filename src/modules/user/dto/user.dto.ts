import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseFilter } from 'src/common/filter-builder/custom-base.filter';
import { User } from 'src/database/entities';

export class ListUserDto extends BaseFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    required: false,
    enum: User.GENDER_USER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  gender: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false, type: Boolean })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  download?: boolean;
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
