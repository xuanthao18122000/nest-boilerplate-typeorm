import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@Exclude()
export class UpdateRolesDto {
  public id: number;
  @ApiProperty({ type: 'string', example: '' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  public key: string;

  @ApiProperty({ type: 'string', example: '' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  public name: string;

  @ApiProperty({ enum: [-1, 1], required: false })
  @IsNumber()
  @Type(() => Number)
  @IsIn([-1, 1])
  @IsOptional()
  public status: number;

  @ApiProperty({ example: [] })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  listActions: Array<ActionDefault>;
}

class ActionDefault {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: 'string', example: '' })
  @IsNotEmpty()
  @IsString()
  key: string;
}
