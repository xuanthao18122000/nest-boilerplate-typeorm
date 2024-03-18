import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  ListHistoryExportDto,
  StatisticsExportsDto,
} from './dto/history-export.dto';
import { HistoryExportService } from './history-export.service';

@ApiBearerAuth()
@ApiTags('History Export')
@Controller('history-exports')
@UsePipes(new ValidationPipe({ transform: true }))
export class HistoryExportController {
  constructor(private readonly historyExportService: HistoryExportService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách lịch sử xuất dữ liệu' })
  async getAll(@Query() query: ListHistoryExportDto, @GetUser() user: User) {
    const exports = await this.historyExportService.getAll(query, user);
    return SendResponse.success(
      exports,
      'Get list history exports successful!',
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: `Thông kê lịch sử xuất dữ liệu` })
  async contributionStatistics(@Query() query: StatisticsExportsDto) {
    const statistics = await this.historyExportService.statistics(query);
    return SendResponse.success(
      statistics,
      'Get statistics history exports successful!',
    );
  }
}
