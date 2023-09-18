import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsObject, IsString, Min, IsEnum, IsBoolean, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from '../enums'
import { IQueryBuilder } from '../interfaces';

export class CustomBaseFilter {
  @ApiProperty({
    description: '( Page > 0 )',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @ValidateIf(o => typeof o.page === 'number')
  @IsNumber()
  @Min(1, { message: 'Page must be greater than 0' })
  page: number | string;

  @ApiProperty({
    description: '( perPage > 0 )',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'perPage must be greater than 0' })
  perPage: number;

  @ApiProperty({
    description: 'Filter Fields',
    example: { name: '' },
    required: false,
  })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return false;
    }
  })
  @IsObject({
    message: 'Invalid filter',
  })
  @IsOptional()
  filter: IQueryBuilder;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort must be either "ASC" or "DESC"' })
  sort: string;

}
