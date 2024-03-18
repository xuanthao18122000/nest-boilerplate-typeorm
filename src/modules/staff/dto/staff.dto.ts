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
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { Staff } from 'src/submodules/database/entities';

export class ListStaffDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volumeArchived: number;

  @ApiProperty({ required: false, description: 'ASE ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  aseId: number;

  @ApiProperty({ required: false, description: 'ASE' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salesHeadId: number;

  @ApiProperty({ required: false, description: '' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  positionId: number;

  @ApiProperty({ required: false, description: '' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({
    required: false,
    description: 'Array of numbers',
    type: [Number],
    example: [],
  })
  provinceIds: number[];

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Staff.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;

  @ApiProperty({ required: false, description: 'Get all records' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isSalesHead?: boolean = false;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value to.Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
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
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  aseId: number;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  salesHeadId: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number> = [];

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  areaId: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  rouId: number;

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

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, description: 'Volume Archived' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volumeArchived: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  positionId: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  salesHeadId: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number>;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  areaId: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rouId: number;

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
