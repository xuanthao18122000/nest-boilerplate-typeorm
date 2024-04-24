import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';

export class ListActivityLogsDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'Activity ID' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false, description: 'Path' })
  @IsString()
  @IsOptional()
  path: string;

  @ApiProperty({ required: false, description: 'Creator ID' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  creatorId: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created to (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}
