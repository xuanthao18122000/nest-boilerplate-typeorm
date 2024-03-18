import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';

export class StatisticsExportsDto {
  @ApiProperty({ required: false, description: '' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year: number;
}

export class ListHistoryExportDto extends PaginationOptions {}
