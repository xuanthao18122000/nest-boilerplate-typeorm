import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { IContactOD } from 'src/submodules/common/interfaces/official-distributor.interface';
import { ORP } from 'src/submodules/database/entities';

export class StatisticsOCsDto {
  @ApiProperty({ required: false, description: 'Province' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'District' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId: number;

  @ApiProperty({ required: false, description: 'Month' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({ required: false, description: 'Year' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year: number;
}

export class CreateOtherCustomerDto {
  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsNotEmpty()
  longName: string;

  @ApiProperty({ required: false, description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ required: false, description: 'Working Unit' })
  @IsString()
  @IsNotEmpty()
  workingUnit: string;

  @ApiProperty({
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

  @ApiProperty({
    required: false,
    description:
      'Category = ' + JSON.stringify(ORP.CATEGORY_POTENTIAL, null, 1),
    enum: ORP.CATEGORY_POTENTIAL,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.CATEGORY_POTENTIAL)
  category: number;

  @ApiProperty({
    required: false,
    description: 'Priority = ' + JSON.stringify(ORP.PRIORITY, null, 1),
    enum: ORP.PRIORITY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.PRIORITY)
  priority: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  managerId: number;

  @ApiProperty({
    required: false,
    example: [
      {
        name: '',
        status: '',
        phoneNumber: '',
      },
    ],
    description: 'Contact Information',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  contactInformation: IContactOD[];

  @ApiProperty({ required: false, description: 'Image' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images: Array<string> = [];

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  wardId: number;

  @ApiProperty({ required: false, description: 'Address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false, description: 'Latitude' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ required: false, description: 'Longitude' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lng: number;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;
}

export class ListOtherCustomerDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'OD ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'Micro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'Province' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'District' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId: number;

  @ApiProperty({ required: false, description: 'Ward' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  wardId: number;

  @ApiProperty({ required: false, description: 'Address' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, description: 'Working Unit' })
  @IsString()
  @IsOptional()
  workingUnit: string;

  @ApiProperty({ required: false, description: 'Phone Number' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false, description: 'Email' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    description:
      'Category = ' + JSON.stringify(ORP.CATEGORY_POTENTIAL, null, 1),
    enum: ORP.CATEGORY_POTENTIAL,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.STATUS)
  category: number;

  @ApiProperty({
    required: false,
    description: 'Priority = ' + JSON.stringify(ORP.PRIORITY, null, 1),
    enum: ORP.PRIORITY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.PRIORITY)
  priority: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(ORP.STATUS, null, 1),
    enum: ORP.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.STATUS)
  status: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created from. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateFrom: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Created to. Type: YYYY/mm/dd hh:mm:ss',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  createdDateTo: Date;
}

export class UpdateOtherCustomerDto {
  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'OD name' })
  @IsString()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'Email' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false, description: 'Working Unit' })
  @IsString()
  @IsOptional()
  workingUnit: string;

  @ApiProperty({
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

  @ApiProperty({
    required: false,
    description:
      'Category = ' + JSON.stringify(ORP.CATEGORY_POTENTIAL, null, 1),
    enum: ORP.CATEGORY_POTENTIAL,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.CATEGORY_POTENTIAL)
  category: number;

  @ApiProperty({
    required: false,
    description: 'Priority = ' + JSON.stringify(ORP.PRIORITY, null, 1),
    enum: ORP.PRIORITY,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.PRIORITY)
  priority: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  managerId: number;

  @ApiProperty({
    required: false,
    example: [
      {
        name: '',
        status: '',
        phoneNumber: '',
      },
    ],
    description: 'Contact Information',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  contactInformation: IContactOD[];

  @ApiProperty({ required: false, description: 'Image' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  @IsArray()
  @IsOptional()
  images: Array<string>;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  wardId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'Address' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, description: 'Latitude' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ required: false, description: 'Longitude' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng: number;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    description: 'Status = ' + JSON.stringify(ORP.STATUS, null, 1),
    enum: ORP.STATUS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.STATUS)
  status: number;
}
