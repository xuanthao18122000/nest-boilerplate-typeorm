import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { ActivityLogDetail } from 'src/submodules/database/entities';
import { ActivityLogService } from './activity-log.service';
import { ListActivityLogsDto } from './dto/activity-log.dto';

@ApiBearerAuth()
@ApiTags('Activity Logs')
@Controller('activity-logs')
@UsePipes(new ValidationPipe({ transform: true }))
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách lịch sử hoạt động' })
  async getAll(@Query() query: ListActivityLogsDto) {
    const activityLogs = await this.activityLogService.getAll(query);
    return SendResponse.success(
      activityLogs,
      'Get list activity logs successful!',
    );
  }

  @Get(':module')
  @ApiOperation({
    summary: 'Chi tiết lịch sử chỉnh sửa',
    description:
      'Module = ' + JSON.stringify(ActivityLogDetail.MODULE, null, 1),
  })
  async detailActivityLog(
    @Param('module') module: number,
    @Query() query: PaginationOptions,
  ) {
    const activityLog = await this.activityLogService.getDetails(module, query);
    return SendResponse.success(
      activityLog,
      'Get detail activity log successful!',
    );
  }
}
