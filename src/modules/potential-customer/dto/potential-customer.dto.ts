import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { ORP } from 'src/submodules/database/entities';

export class StatisticsPCsDto {
  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'Month' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({ required: false, description: 'Year' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year: number;
}

export class ListPCDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'OD ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  shortName: string;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'OD' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  odId: number;

  @ApiProperty({ required: false, description: 'Province' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({
    required: false,
    description:
      'Category = ' + JSON.stringify(ORP.CATEGORY_POTENTIAL, null, 1),
    enum: ORP.CATEGORY_POTENTIAL,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.CATEGORY_POTENTIAL)
  category: number;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'ASE Sales' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(ORP.STATUS_PC, null, 1),
    enum: ORP.STATUS_PC,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.STATUS_PC)
  status: number;

  @ApiProperty({
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

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

  @ApiProperty({ required: false, description: 'OD ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  creatorId: number;
}

export class UpdatePCDto {
  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(ORP.STATUS_PC, null, 1),
    enum: ORP.STATUS_PC,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.STATUS_PC)
  status: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rejectReason: string;
}
