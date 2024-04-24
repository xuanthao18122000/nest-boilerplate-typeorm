import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { GetCoordinatesDistrictDto, GetLocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@ApiBearerAuth()
@ApiTags('24. Location')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách Đất nước, tỉnh, huyện, xã' })
  async getAll(@Query() query: GetLocationDto) {
    const locations = await this.locationService.getAll(query);
    return SendResponse.success(locations, 'Get locations successful!');
  }

  @Get('district/geo-maps')
  @ApiOperation({ summary: 'Danh sách district có tọa độ' })
  async districtsWithCoordinates(@Query() query: GetCoordinatesDistrictDto) {
    const districts = await this.locationService.districtsWithCoordinates(
      query,
    );
    return SendResponse.success(
      districts,
      'Get coordinates district successful!',
    );
  }
}
