import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';

export class ListLocationLookupDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ASE ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  staffId: number;

  @ApiProperty({ required: false, description: 'ASE Name' })
  @IsString()
  @IsOptional()
  staffName: string;

  @ApiProperty({ required: false, description: 'Micro Market' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'OD/RTL Name' })
  @IsString()
  @IsOptional()
  orpName: string;
}
