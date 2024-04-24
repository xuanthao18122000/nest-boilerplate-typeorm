import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder';

export class ListRbacActionsDto extends PaginationOptions {}

export class CreateRbacActions {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  module: string;
}

export class CreateMultipleRbacActions {
  @ApiProperty({
    type: CreateRbacActions,
    example: [
      {
        key: '',
        name: '',
        module: '',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  actions: CreateRbacActions[];
}
