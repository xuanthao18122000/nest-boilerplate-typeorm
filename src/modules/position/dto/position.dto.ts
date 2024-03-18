import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { INamePosition } from 'src/submodules/common/interfaces';
import { Position } from 'src/submodules/database/entities';

export class ListPositionDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Position.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;
}

export class CreatePositionDto {
  @ApiProperty({ required: false, example: { vi: '', en: '' } })
  @IsObject()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  name: INamePosition;

  @ApiProperty({ required: false, description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: false,
    description: 'Type = ' + JSON.stringify(Position.TYPE, null, 1),
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  type: number;
}

export class UpdatePositionDto {
  @ApiProperty({ required: false, example: { vi: '', en: '' } })
  @IsObject()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  name: INamePosition;

  @ApiProperty({ required: false, description: 'Description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Position.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;

  @ApiProperty({
    required: false,
    description: 'Type = ' + JSON.stringify(Position.TYPE, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type: number;
}
