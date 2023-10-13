import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseFilter } from 'src/common/share/custom-base.filter';
import { User } from 'src/database/entities';

export class ListUserDto extends BaseFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: User.GENDER_USER.MALE, required: false })
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  @IsOptional()
  gender: number;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: User.GENDER_USER.MALE })
  @Type(() => Number)
  @IsEnum(User.GENDER_USER)
  @IsNotEmpty()
  gender: number;
}

export class UpdateUserDto {}
