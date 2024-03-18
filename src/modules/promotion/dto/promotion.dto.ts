import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { Promotion } from 'src/submodules/database/entities';

export class RegionPromotionDto {
  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, default: 2024 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year: number;
}
export class CreatePromotionDto {
  @ApiProperty({ required: false, description: 'Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, description: 'OD Image' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ required: false, description: 'Latitude' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  cost: number;

  @ApiProperty({
    required: false,
    description:
      'Send Type = ' + JSON.stringify(Promotion.CONTENT_TYPE, null, 1),
    enum: Promotion.CONTENT_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.CONTENT_TYPE)
  contentType: number;

  @ApiProperty({ required: false, description: 'Content' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ required: false, description: 'Pdf' })
  @IsString()
  @IsOptional()
  pdf: string;

  @ApiProperty({
    required: false,
    description: 'Send Type = ' + JSON.stringify(Promotion.SEND_TYPE, null, 1),
    enum: Promotion.SEND_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.SEND_TYPE)
  sendType: number;

  @ApiProperty({
    required: false,
    description: 'Promotion Type = ' + JSON.stringify(Promotion.TYPE, null, 1),
    enum: Promotion.TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.TYPE)
  type: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start Date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End Date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  staffIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  areaIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  productIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  attachedList?: Array<string> = [];
}

export class ListPromotionDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'Cost/Ton' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost: number;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  creatorId: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Promotion.STATUS, null, 1),
    enum: Promotion.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.STATUS)
  status: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start to. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDateTo: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End to. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDateTo: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created to. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}

export class UpdatePromotionDto {
  @ApiProperty({ required: false, description: 'Title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false, description: 'OD Image' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ required: false, description: 'Latitude' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost: number;

  @ApiProperty({
    required: false,
    description:
      'Send Type = ' + JSON.stringify(Promotion.CONTENT_TYPE, null, 1),
    enum: Promotion.CONTENT_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.CONTENT_TYPE)
  contentType: number;

  @ApiProperty({ required: false, description: 'Content' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ required: false, description: 'Pdf' })
  @IsString()
  @IsOptional()
  pdf: string;

  @ApiProperty({
    required: false,
    description: 'Send Type = ' + JSON.stringify(Promotion.SEND_TYPE, null, 1),
    enum: Promotion.SEND_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.SEND_TYPE)
  sendType: number;

  @ApiProperty({
    required: false,
    description: 'Promotion Type = ' + JSON.stringify(Promotion.TYPE, null, 1),
    enum: Promotion.TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.TYPE)
  type: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start Date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End Date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  staffIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  areaIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  productIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  attachedList?: Array<string>;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Promotion.STATUS, null, 1),
    enum: Promotion.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Promotion.STATUS)
  status: number;
}
