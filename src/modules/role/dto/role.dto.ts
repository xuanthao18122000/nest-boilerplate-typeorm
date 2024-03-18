import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { Role } from 'src/submodules/database/entities';

export class ListRolesDto extends PaginationOptions {}

export class CreateRolesDto {
  @ApiProperty({ type: 'string', example: '' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  permissions: Array<string> = [];
}

export class UpdateRolesDto {
  @ApiProperty({ type: 'string', example: '' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Role.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Role.STATUS)
  status: number;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  permissions: Array<string>;
}
