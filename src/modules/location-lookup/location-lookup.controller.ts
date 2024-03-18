import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { ListLocationLookupDto } from './dto/location-lookup.dto';
import { LocationLookupService } from './location-lookup.service';

@ApiBearerAuth()
@ApiTags('12. Location Lookups')
@Controller('location-lookups')
@UsePipes(new ValidationPipe({ transform: true }))
export class LocationLookupController {
  constructor(private readonly locationLookupService: LocationLookupService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tra cứu vị trí' })
  @ActivityLog('API_LOCATION_LOOKUP_LIST')
  async getAll(@Query() query: ListLocationLookupDto) {
    const locationLookups = await this.locationLookupService.getAll(query);
    return SendResponse.success(
      locationLookups,
      'Get list location lookups successful!',
    );
  }

  @Get(':staffId')
  @ApiOperation({ summary: 'Chi tiết tra cứu vị trí' })
  @ActivityLog('API_LOCATION_LOOKUP_DETAIL')
  async getOne(@Param('staffId') staffId: number) {
    const locationLookups = await this.locationLookupService.getOne(staffId);
    return SendResponse.success(
      locationLookups,
      'Get detail location lookup successful!',
    );
  }
}
