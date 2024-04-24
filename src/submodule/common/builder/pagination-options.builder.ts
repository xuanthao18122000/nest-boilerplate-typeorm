import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { LANGUAGE_ENUM, SORT_ENUM } from '../enums';

export class PaginationOptions {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Page you want to display',
  })
  @Type(() => Number)
  @IsOptional()
  @ValidateIf((o) => typeof o.page === 'number')
  @IsNumber()
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Number of records per page',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'perPage must be greater than 0' })
  perPage?: number = 10;

  @ApiProperty({ enum: SORT_ENUM, required: false, description: 'Sort By ID' })
  @IsEnum(SORT_ENUM)
  @IsOptional()
  sort?: SORT_ENUM;

  @ApiProperty({ required: false, description: 'Get all records' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  getFull?: boolean = false;

  @ApiProperty({
    required: false,
    description: `Language = ${JSON.stringify(LANGUAGE_ENUM, null, 1)}`,
    enum: LANGUAGE_ENUM,
  })
  @IsOptional()
  @IsString()
  @IsEnum(LANGUAGE_ENUM)
  language?: LANGUAGE_ENUM = LANGUAGE_ENUM.EN;
}
