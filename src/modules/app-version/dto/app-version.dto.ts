import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { AppVersion } from 'src/submodules/database/entities';

export class HistoryVersionDto extends PaginationOptions {
  @ApiProperty({
    description: 'Platform = ' + JSON.stringify(AppVersion.PLATFORM, null, 1),
    enum: AppVersion.PLATFORM,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(AppVersion.PLATFORM)
  platform: string;
}
export class CreateVersionDto {
  @ApiProperty({
    description: 'Platform = ' + JSON.stringify(AppVersion.PLATFORM, null, 1),
    enum: AppVersion.PLATFORM,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(AppVersion.PLATFORM)
  platform: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  version: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean;
}
