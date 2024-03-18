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
import { Product } from 'src/submodules/database/entities';

export class CreateProductDto {
  @ApiProperty({ required: false, description: 'Title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Avatar' })
  @IsString()
  @IsNotEmpty()
  avatar?: string;

  @ApiProperty({ required: false, description: 'Avatar' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, description: 'Brand ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images?: Array<string> = [];
}

export class ListProductDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'Creator ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  creatorId: number;

  @ApiProperty({ required: false, description: 'Brand' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Product.STATUS, null, 1),
    enum: Product.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Product.STATUS)
  status: number;

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

export class UpdateProductDto {
  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: 'Avatar' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false, description: 'Avatar' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, description: 'Brand ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId?: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Product.STATUS, null, 1),
    enum: Product.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Product.STATUS)
  status?: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images?: Array<string>;
}
