import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  GetKpiConfigurationDto,
  UpdateConfigKpiDto,
} from './dto/kpi-configuration.dto';
import { KpiConfigureService } from './kpi-configuration.service';

@ApiBearerAuth()
@ApiTags('15. KPI Configuration')
@Controller('kpi-visiting-routes')
@UsePipes(new ValidationPipe({ transform: true }))
export class KpiConfigureController {
  constructor(private readonly kpiConfigureService: KpiConfigureService) {}

  @Get('')
  @ApiOperation({ summary: 'Get cấu hình KPI' })
  @ActivityLog('API_KPI_CONFIGURE_GET')
  async getOne(@Query() query: GetKpiConfigurationDto) {
    const kpiConfigure = await this.kpiConfigureService.getOne(query);
    return SendResponse.success(
      kpiConfigure,
      'Get detail KPI configuration successful!',
    );
  }

  @Put('')
  @ApiOperation({ summary: 'Cập nhật cấu hình KPI' })
  @ActivityLog('API_KPI_CONFIGURE_UPDATE')
  async update(@Body() body: UpdateConfigKpiDto, @GetUser() user: User) {
    const kpiConfigure = await this.kpiConfigureService.update(body, user);
    return SendResponse.success(
      kpiConfigure,
      'Update KPI configuration successful!',
    );
  }
}
