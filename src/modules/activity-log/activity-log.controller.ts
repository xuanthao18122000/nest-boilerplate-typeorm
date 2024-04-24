import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { ActivityLogDetail } from 'src/submodule/database/entities';
import { ActivityLogService } from './activity-log.service';
import { ListActivityLogsDto } from './dto/activity-log.dto';

@ApiBearerAuth()
@ApiTags('26. Activity Logs')
@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ActivityLog('ACTIVITY_LOG_LIST')
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
