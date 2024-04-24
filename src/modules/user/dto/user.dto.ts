import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { User } from 'src/submodule/database/entities';

export class ListUserDto extends PaginationOptions {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rouId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  provinceId?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  areaId?: number;

  @ApiProperty({ required: false, description: 'User name' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false, description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  roleId?: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(User.STATUS, null, 1),
    enum: User.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(User.STATUS)
  status?: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created to (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo?: Date;
}

export class TopActivityDto {
  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  number: number;
}

export class CreateUserDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rouId: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  rouIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  areaIds?: Array<number> = [];

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllRous?: boolean = false;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean = false;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllAreas?: boolean = false;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  permissions: Array<string> = [];
}

export class UpdateUserDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  roleId: number;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rouId: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllRous?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllAreas?: boolean;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  rouIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  areaIds?: Array<number>;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(User.STATUS, null, 1),
    enum: User.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(User.STATUS)
  status: number;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  permissions: Array<string>;
}
