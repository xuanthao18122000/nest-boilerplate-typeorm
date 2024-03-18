import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { LANGUAGE_ENUM } from 'src/submodules/common/enums';

export class ListKpiByROUDto extends PaginationOptions {}

export class TemplateKpiVolumeDto {
  @ApiProperty({
    required: false,
    description: `Language = ${JSON.stringify(LANGUAGE_ENUM, null, 1)}`,
    enum: LANGUAGE_ENUM,
  })
  @IsOptional()
  @IsString()
  @IsEnum(LANGUAGE_ENUM)
  lang: LANGUAGE_ENUM;
}

export class ListKpiVolumeDto {
  @ApiProperty({ required: false, description: 'month' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({ required: false, description: 'year' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;
}

export class DeleteKPIVolumeDto {
  @ApiProperty({ required: false, description: 'year' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class CreateKPIVolumeDto {
  @ApiProperty({ required: false, description: 'year' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  months?: Array<number> = [];

  @ApiProperty({ required: false, description: 'OD ID' })
  @IsNotEmpty({ message: 'OD_ID_NOT_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'OD_ID_IS_NUMBER' })
  odId: number;

  @ApiProperty({ required: false, description: 'Staff ID' })
  @IsNotEmpty({ message: 'STAFF_ID_NOT_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'STAFF_ID_IS_NUMBER' })
  staffId: number;

  @ApiProperty({ required: false, description: 'Target Volume' })
  @IsNotEmpty({ message: 'TARGET_VOLUME_NOT_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'TARGET_VOLUME_IS_NUMBER' })
  targetVolume: number;
}
