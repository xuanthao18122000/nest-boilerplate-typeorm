import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { KpiConfiguration } from 'src/submodules/database/entities';

export class GetKpiConfigurationDto {
  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(KpiConfiguration.STATUS, null, 1),
    enum: KpiConfiguration.STATUS,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(KpiConfiguration.STATUS)
  status: number;
}

export class UpdateConfigKpiDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  mcpDay?: number;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  visitingRoute?: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Aplication Date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsNotEmpty()
  applicationDate: Date;
}
