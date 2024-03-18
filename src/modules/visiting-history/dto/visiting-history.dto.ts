import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { VisitingHistory } from 'src/submodules/database/entities';

export class ListVisitingHistoryDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID ASE' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  staffId: number;

  @ApiProperty({ required: false, description: 'ASE' })
  @IsString()
  @IsOptional()
  staffName: string;

  @ApiProperty({ required: false, description: 'OD/RTL Name' })
  @IsString()
  @IsOptional()
  orpName: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(VisitingHistory.STATUS, null, 1),
    enum: VisitingHistory.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(VisitingHistory.STATUS)
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
    description: 'Created to. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}

export class UpdateVisitingHistoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  reasonCancel: string;

  status: number = VisitingHistory.STATUS.REJECTED;
}
