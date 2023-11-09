import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/common/builder/pagination-options.builder';

export class ListNotificationDto extends PaginationOptions {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  category: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  typeSchedule: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  creatorId: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  typeReceiver: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  status: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sentDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sentDateTo: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createDateTo: Date;

  @ApiProperty({ required: false, type: Boolean })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  download?: boolean;
}

export class CreateNotificationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  category: number;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  typeSchedule: number;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  creatorId: number;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  typeReceiver: number;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  status: number;

  @ApiProperty({})
  @Type(() => Number)
  // @IsEnum(Notification.GENDER_Notification)
  @IsNotEmpty()
  gender: number;
}
export class UpdateNotificationDto {
  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  status: number;
}
