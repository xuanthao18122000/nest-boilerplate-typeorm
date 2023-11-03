import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

@Exclude()
export class CreateRolesDto {
  @ApiProperty({ type: 'string', example: '' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  key: string;

  @ApiProperty({ type: 'string', example: '' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({ example: [] })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  listActions: Array<ActionDefault>;
}

class ActionDefault {
  @ApiProperty({ type: 'string', example: '' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: 'string', example: '' })
  @IsNotEmpty()
  @IsString()
  key: string;
}

[
  {
    key: 'SUPER_ADMIN',
    name: 'Super Admin',
    listActions: [],
  },
  {
    key: 'ADMIN',
    name: 'Admin',
    listActions: [],
  },
  {
    key: 'SALE_LEADER',
    name: 'Sale Leader',
    listActions: [],
  },
];
