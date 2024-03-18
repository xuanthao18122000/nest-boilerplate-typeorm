import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignUpDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateProfileDto {
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

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  avatar: string;
}

export class FireBaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firebaseToken: string;
}
