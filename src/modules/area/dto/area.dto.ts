import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { Area } from 'src/submodule/database/entities';

export class StatisticsAreaDto {
  @ApiProperty({ description: 'ROU ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ description: 'Province ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'Area ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;
}

export class ListAreaDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Province' })
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
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  provinceIds: number[];

  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Area.STATUS, null, 1),
    enum: Area.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Updated from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  updatedDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Updated to.Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  updatedDateTo: Date;
}

export class CreateAreaDto {
  @ApiProperty({ required: false, description: 'Area Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Province ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  districtIds?: Array<number> = [];
}

export class CreateAreaDistrictDto {
  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number> = [];
}

export class UpdateAreaDto {
  @ApiProperty({ required: false, description: 'Area Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Area.STATUS, null, 1),
    enum: Area.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;

  @ApiProperty({ required: false, description: 'Province ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({
    required: false,
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  districtIds?: Array<number>;
}
