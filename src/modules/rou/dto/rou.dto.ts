import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { ROU } from 'src/submodules/database/entities';

export class ListROUDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(ROU.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
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
    description: 'Created to.Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}

export class CreateROUDto {
  @ApiProperty({ required: false, description: 'Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinces?: Array<string> = [];
}

export class AssignRouToProvinceDto {
  @ApiProperty({ required: false, description: 'ROU Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinces?: Array<string> = [];
}

export class UpdateROUDto {}
