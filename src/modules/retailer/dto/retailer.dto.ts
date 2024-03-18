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

export class CreateRetailerDto {
  @ApiProperty({ required: false, description: 'Short name' })
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'Long name' })
  @IsNotEmpty()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'OD Image' })
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

  @ApiProperty({ required: false, description: 'Key contact' })
  @IsString()
  @IsNotEmpty()
  contactKey: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ required: false, description: 'Presenter' })
  @IsString()
  @IsOptional()
  presenter: string;

  @ApiProperty({ required: false, description: 'Address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

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

  @ApiProperty({ required: false, description: 'ID Area' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ description: 'OD' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  odId: number;

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
}

export class ListRetailerDto extends PaginationOptions {
  @ApiProperty({ required: false, description: 'OD ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, description: 'Short name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'Long name' })
  @IsString()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'Key contact' })
  @IsString()
  @IsOptional()
  contactKey: string;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'OD' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  odId: number;

  @ApiProperty({ required: false, description: 'ASE Sales' })
  @IsString()
  @IsOptional()
  fullName: string;

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
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

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

export class UpdateRetailerDto {
  @ApiProperty({ required: false, description: 'Short name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: 'Long name' })
  @IsString()
  @IsOptional()
  longName: string;

  @ApiProperty({ required: false, description: 'OD Image' })
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

  @ApiProperty({ required: false, description: 'Key contact' })
  @IsString()
  @IsOptional()
  contactKey: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false, description: 'Presenter' })
  @IsString()
  @IsOptional()
  presenter: string;

  @ApiProperty({ required: false, description: 'ID province' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;

  @ApiProperty({ required: false, description: 'ID District' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId: number;

  @ApiProperty({ required: false, description: 'ID Ward' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  wardId: number;

  @ApiProperty({ required: false, description: 'ID Area' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false, description: 'Address' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, description: 'ROU' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rouId: number;

  @ApiProperty({
    required: false,
    description: 'Size = ' + JSON.stringify(ORP.SIZE, null, 1),
    enum: ORP.SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ORP.SIZE)
  size: number;

  @ApiProperty({ required: false, description: 'ASE management' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  managerId: number;

  @ApiProperty({ required: false, description: 'OD' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  odId: number;

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
}
