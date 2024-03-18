import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { GetLocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@ApiBearerAuth()
@ApiTags('Location')
@Controller('locations')
@UsePipes(new ValidationPipe({ transform: true }))
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách Đất nước, tỉnh, huyện, xã' })
  async getAll(@Query() query: GetLocationDto) {
    const locations = await this.locationService.getAll(query);
    return SendResponse.success(locations, 'Get locations successful!');
  }
}
