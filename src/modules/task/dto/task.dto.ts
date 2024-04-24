import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { Survey, Task } from 'src/submodule/database/entities';

export class StatisticsTasksDto {
  @ApiProperty({ required: false, description: 'Province' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'Month' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({ required: false, description: 'Year' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;
}

export class ListTaskDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiProperty({ required: false, description: 'ASE' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Task.CATEGORY, null, 1),
    enum: Task.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.CATEGORY)
  category?: number;

  @ApiProperty({
    required: false,
    description:
      'CUSTOMER_TYPE = ' + JSON.stringify(Task.CUSTOMER_TYPE, null, 1),
    enum: Task.CUSTOMER_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.CUSTOMER_TYPE)
  customerType?: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Task.STATUS, null, 1),
    enum: Task.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.STATUS)
  status?: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @ApiProperty({ required: false, example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  provinceId?: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Sales value to.Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo?: Date;
}

export class CreateSurveyDto {
  @ApiProperty({
    required: false,
  })
  @IsArray()
  @IsOptional()
  questions: CreateQuestionsDto[];
}

export class CreateQuestionsDto {
  @ApiProperty({
    required: false,
    description:
      'Question Type = ' + JSON.stringify(Survey.TYPE_QUESTION, null, 1),
    enum: Survey.TYPE_QUESTION,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Survey.TYPE_QUESTION)
  type: number;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images: Array<string> = [];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isRequired: boolean = false;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  answers: AnswerSurvey[];
}

class AnswerSurvey {
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  answer: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images: Array<string> = [];
}

export class CreateTaskDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description:
      'CUSTOMER_TYPE = ' + JSON.stringify(Task.CUSTOMER_TYPE, null, 1),
    enum: Task.CUSTOMER_TYPE,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Task.CUSTOMER_TYPE)
  customerType: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllRous?: boolean = false;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsNotEmpty()
  rouIds?: Array<number> = [];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean = false;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsNotEmpty()
  provinceIds?: Array<number> = [];

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Task.CATEGORY, null, 1),
    enum: Task.CATEGORY,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(Task.CATEGORY)
  category: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start Date. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End Date. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isRequired: boolean;

  @ApiProperty({
    required: false,
    example: {
      questions: [
        {
          type: '',
          question: '',
          images: [],
          isRequired: '',
          answers: [
            {
              answer: '',
              images: [],
            },
          ],
        },
      ],
    },
  })
  @IsOptional()
  survey: CreateSurveyDto;
}

export class UpdateTaskDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description:
      'CUSTOMER_TYPE = ' + JSON.stringify(Task.CUSTOMER_TYPE, null, 1),
    enum: Task.CUSTOMER_TYPE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.CUSTOMER_TYPE)
  customerType: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isRequired: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllProvinces?: boolean;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  provinceIds?: Array<number>;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAllRous?: boolean;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  rouIds?: Array<number>;

  @ApiProperty({
    required: false,
    description: 'Category = ' + JSON.stringify(Task.CATEGORY, null, 1),
    enum: Task.CATEGORY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.CATEGORY)
  category: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(Task.STATUS, null, 1),
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Task.STATUS)
  status: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Start Date. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'End Date. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({
    required: false,
    example: {
      questions: [
        {
          type: '',
          question: '',
          images: [],
          isRequired: '',
          answers: [
            {
              answer: '',
              images: [],
            },
          ],
        },
      ],
    },
  })
  @IsOptional()
  survey: CreateSurveyDto;
}
