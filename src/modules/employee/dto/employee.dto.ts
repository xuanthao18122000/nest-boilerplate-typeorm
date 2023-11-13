import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/common/builder/pagination-options.builder';
import { Employee } from 'src/database/entities';

export class ListEmployeeDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'Full name' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    required: false,
    description: 'Gender',
    enum: Employee.GENDER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Employee.GENDER)
  gender: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created from. Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created to.Type: YYYY/mm/dd',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;

  // @ApiProperty({
  //   required: false,
  //   type: Boolean,
  //   description: 'Tải file excel',
  // })
  // @Transform(({ value }) => value === 'true')
  // @IsBoolean()
  // @IsOptional()
  // download?: boolean;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: Employee.GENDER.MALE })
  @Type(() => Number)
  @IsEnum(Employee.GENDER)
  @IsNotEmpty()
  gender: number;
}

export class UpdateEmployeeDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: '', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, example: Employee.GENDER.MALE })
  @Type(() => Number)
  @IsEnum(Employee.GENDER)
  @IsOptional()
  gender: number;
}
