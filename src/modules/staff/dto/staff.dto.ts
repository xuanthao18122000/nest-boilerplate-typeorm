import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { Staff } from 'src/submodule/database/entities';

export class StatisticsStaffDto {
  @ApiProperty({ description: 'ROU' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ description: 'Month' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({ description: 'Year' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;
}
export class ListStaffDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volumeArchived?: number;

  @ApiProperty({ required: false, description: 'ASE ID' })
  @IsString()
  @IsOptional()
  aseId?: string;

  @ApiProperty({ required: false, description: 'Position ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  positionId?: number;

  @ApiProperty({ required: false, description: 'ASE' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  salesHead?: string;

  @ApiProperty({ required: false, description: '' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId?: number;

  @ApiProperty({
    required: false,
    description: 'Array of numbers',
    type: [Number],
    example: [],
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  rouIds?: number[];

  @ApiProperty({
    required: false,
    description: 'Array of numbers',
    type: [Number],
    example: [],
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  provinceIds?: number[];

  @ApiProperty({
    required: false,
    description: 'Array of numbers',
    type: [Number],
    example: [],
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  areaIds?: number[];

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId?: number;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId?: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Staff.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value to.Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo?: Date;
}

export class CreateStaffDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volumeArchived: number;

  @ApiProperty({ required: false, description: 'ASE ID' })
  @IsString()
  @IsOptional()
  aseId: string;

  @ApiProperty({ required: false, description: 'Position ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  positionId: number;

  @ApiProperty({ required: false, description: 'Rou ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  salesHead: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean = false;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllAreas?: boolean = false;

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

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  address: string;
}

export class UpdateStaffDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, description: 'ASE ID' })
  @IsString()
  @IsOptional()
  aseId: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllAreas?: boolean;

  @ApiProperty({ required: false, description: 'Position ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  positionId: number;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volumeArchived: number;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  salesHead: string;

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

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

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
    description: 'Status = ' + JSON.stringify(Staff.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;
}
