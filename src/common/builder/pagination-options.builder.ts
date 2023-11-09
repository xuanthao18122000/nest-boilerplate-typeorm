import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { SORT_ENUM } from '../enums';

export class PaginationOptions {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Trang muốn hiển thị',
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
    description: 'Số lượng record 1 trang',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'perPage must be greater than 0' })
  perPage: number;

  @ApiProperty({ enum: SORT_ENUM, required: false, description: 'Sắp xếp' })
  @IsEnum(SORT_ENUM)
  @IsOptional()
  sort: SORT_ENUM;

  @ApiProperty({ required: false, description: 'Lấy tất cả record' })
  @IsBoolean()
  @IsOptional()
  getFull: boolean;
}
