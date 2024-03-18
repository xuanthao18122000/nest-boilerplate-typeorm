import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { Notification } from 'src/submodules/database/entities';

export class StatisticsNotificationDto {
  @ApiProperty({ required: false, default: 2024 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;
}
export class ListNotificationDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Notification.STATUS, null, 1),
    enum: Notification.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.STATUS)
  status: number;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Notification.CATEGORY, null, 1),
    enum: Notification.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.CATEGORY)
  category: number;

  @ApiProperty({
    required: false,
    description:
      'Send mode = ' + JSON.stringify(Notification.TYPE_RECEIVER, null, 1),
    enum: Notification.TYPE_RECEIVER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_RECEIVER)
  typeReceiver: number;

  @ApiProperty({
    required: false,
    description:
      'Send mode = ' + JSON.stringify(Notification.SEND_MODE, null, 1),
    enum: Notification.SEND_MODE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.SEND_MODE)
  sendMode: number;

  @ApiProperty({
    required: false,
    description:
      'Send mode = ' + JSON.stringify(Notification.TYPE_SCHEDULE, null, 1),
    enum: Notification.TYPE_SCHEDULE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_SCHEDULE)
  typeSchedule: number;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  creatorId: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sentDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sentDateTo: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}

export class CreateNotificationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Notification.STATUS, null, 1),
    enum: Notification.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.STATUS)
  status: number;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Notification.CATEGORY, null, 1),
    enum: Notification.CATEGORY,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Notification.CATEGORY)
  category: number;

  @ApiProperty({
    required: false,
    description:
      'Type Schedule = ' + JSON.stringify(Notification.TYPE_SCHEDULE, null, 1),
    enum: Notification.TYPE_SCHEDULE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_SCHEDULE)
  typeSchedule: number;

  @ApiProperty({
    required: false,
    description:
      'Type Receiver = ' + JSON.stringify(Notification.TYPE_RECEIVER, null, 1),
    enum: Notification.TYPE_RECEIVER,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_RECEIVER)
  typeReceiver: number;

  @ApiProperty({
    required: false,
    description:
      'Send mode = ' + JSON.stringify(Notification.SEND_MODE, null, 1),
    enum: Notification.SEND_MODE,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Notification.SEND_MODE)
  sendMode: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  receivers?: Array<number> = [];

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sending schedule from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sendingSchedule: Date;

  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  repeatAfterHour: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startTime: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endTime: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sendingTimeWeekdays: Date;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  repeatWeekdays?: Array<number> = [];

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  attachments?: AttachmentDto[] = [];
}

class AttachmentDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  type: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  link: string;
}

export class UpdateNotificationDto {
  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Notification.STATUS, null, 1),
    enum: Notification.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.STATUS)
  status: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rejectReason: string;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Notification.CATEGORY, null, 1),
    enum: Notification.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.CATEGORY)
  category: number;

  @ApiProperty({
    required: false,
    description:
      'Type Schedule = ' + JSON.stringify(Notification.TYPE_SCHEDULE, null, 1),
    enum: Notification.TYPE_SCHEDULE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_SCHEDULE)
  typeSchedule: number;

  @ApiProperty({
    required: false,
    description:
      'Type Receiver = ' + JSON.stringify(Notification.TYPE_RECEIVER, null, 1),
    enum: Notification.TYPE_RECEIVER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.TYPE_RECEIVER)
  typeReceiver: number;

  @ApiProperty({
    required: false,
    description:
      'Send mode = ' + JSON.stringify(Notification.SEND_MODE, null, 1),
    enum: Notification.SEND_MODE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Notification.SEND_MODE)
  sendMode: number;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number>;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  receivers?: Array<number>;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sending schedule from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sendingSchedule: Date;

  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  repeatAfterHour: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startTime: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endTime: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End date from (YYYY/mm/dd hh:mm:ss)',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  sendingTimeWeekdays: Date;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  repeatWeekdays?: Array<number>;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  attachments?: AttachmentDto[];

  receiversNumber: number;
}
