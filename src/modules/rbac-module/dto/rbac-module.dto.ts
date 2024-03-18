import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder';
import { Role } from 'src/submodules/database/entities';

export class ListRbacModulesDto extends PaginationOptions {
  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Role.STATUS, null, 1),
    enum: Role.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Role.STATUS)
  status: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  roleId: number;
}

export class CreateRbacModules {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateMultipleRbacModules {
  @ApiProperty({
    type: CreateRbacModules,
    example: [
      {
        key: '',
        name: '',
      },
    ],
  })
  @ValidateNested()
  @IsArray()
  @IsOptional()
  modules: CreateRbacModules[];
}

export class CreateRbacActions {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  moduleId: number;
}
