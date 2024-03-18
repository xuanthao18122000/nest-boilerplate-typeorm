import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHotline {
  @ApiProperty({ required: false, description: 'Area Name' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
