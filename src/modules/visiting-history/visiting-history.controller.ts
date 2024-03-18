import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import {
  ListVisitingHistoryDto,
  UpdateVisitingHistoryDto,
} from './dto/visiting-history.dto';

import { VisitingHistoryService } from './visiting-history.service';

@ApiBearerAuth()
@ApiTags('10. Visiting Histories')
@Controller('visiting-histories')
@UsePipes(new ValidationPipe({ transform: true }))
export class VisitingHistoryController {
  constructor(
    private readonly visitingHistoryService: VisitingHistoryService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Danh sách số lượng trạng thái' })
  async getVisitingStatus() {
    const visitingStatus =
      await this.visitingHistoryService.getVisitingStatus();
    return SendResponse.success(
      visitingStatus,
      'Get list visiting histories successful!',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách lịch sử ghé thăm' })
  @ActivityLog('API_VISITING_HISTORY_LIST')
  async getAll(@Query() query: ListVisitingHistoryDto) {
    const visitingHistories = await this.visitingHistoryService.getAll(query);
    return SendResponse.success(
      visitingHistories,
      'Get list visiting histories successful!',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch sử ghé thăm' })
  @ActivityLog('API_RETAILER_DETAIL')
  async getOne(@Param('id') id: number) {
    const visitingHistory = await this.visitingHistoryService.getOne(id);
    return SendResponse.success(
      visitingHistory,
      'Get detail visiting history successful!',
    );
  }

  @Put('reject/:id')
  @ApiOperation({ summary: 'Từ chối lịch sử ghé thăm' })
  @ActivityLog('API_RETAILER_UPDATE')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateVisitingHistoryDto,
  ) {
    const visitingHistory = await this.visitingHistoryService.update(id, body);
    return SendResponse.success(
      visitingHistory,
      'Update visiting history successful!',
    );
  }
}
