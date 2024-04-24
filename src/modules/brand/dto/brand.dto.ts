import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { Brand } from 'src/submodule/database/entities';

export class CreateBrandDto {
  @ApiProperty({ required: false, description: 'Title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Brand.CATEGORY, null, 1),
    enum: Brand.CATEGORY,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Brand.CATEGORY)
  category: number;
}

export class ListBrandDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  creatorId: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Brand.STATUS, null, 1),
    enum: Brand.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Brand.STATUS)
  status: number;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Brand.CATEGORY, null, 1),
    enum: Brand.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Brand.CATEGORY)
  category: number;

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

export class UpdateBrandDto {
  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Brand.STATUS, null, 1),
    enum: Brand.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Brand.STATUS)
  status: number;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Brand.CATEGORY, null, 1),
    enum: Brand.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Brand.CATEGORY)
  category: number;
}
