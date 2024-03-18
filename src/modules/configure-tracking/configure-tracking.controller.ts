import {
  Body,
  Controller,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { ConfigTrackingService } from './configure-tracking.service';
import { UpdateTrackingDto } from './dto/configure-tracking.dto';

@ApiBearerAuth()
@ApiTags('11. Configure Tracking')
@Controller('configure-trackings')
@UsePipes(new ValidationPipe({ transform: true }))
export class ConfigTrackingController {
  constructor(private readonly configTrackingService: ConfigTrackingService) {}

  @Get('')
  @ApiOperation({ summary: 'Get cấu hình Tracking' })
  @ActivityLog('API_CONFIGURE_TRACKING_GET')
  async getOne() {
    const configureTracking = await this.configTrackingService.getOne();
    return SendResponse.success(
      configureTracking,
      'Get detail configure tracking successful!',
    );
  }

  @Put('')
  @ApiOperation({ summary: 'Cập nhật cấu hình Tracking' })
  @ActivityLog('API_CONFIGURE_TRACKING_UPDATE')
  async update(@Body() body: UpdateTrackingDto) {
    const configureTracking = await this.configTrackingService.update(body);
    return SendResponse.success(
      configureTracking,
      'Update configure tracking successful!',
    );
  }
}
