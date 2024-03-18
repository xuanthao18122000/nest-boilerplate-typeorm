import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateTrackingDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  regular?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  timeNormal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  timeCheckIn?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  warning?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  allowedRadius?: number;
}
