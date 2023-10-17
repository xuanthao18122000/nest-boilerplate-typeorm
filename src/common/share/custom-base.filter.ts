import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { SORT_ENUM } from '../enums';

export class BaseFilter {
  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @ValidateIf((o) => typeof o.page === 'number')
  @IsNumber()
  @Min(1, { message: 'Page must be greater than 0' })
  page: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'perPage must be greater than 0' })
  perPage: number;

  @ApiProperty({ enum: SORT_ENUM, required: false })
  @IsEnum(SORT_ENUM)
  @IsOptional()
  sort: SORT_ENUM;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  getFull: boolean;
}
