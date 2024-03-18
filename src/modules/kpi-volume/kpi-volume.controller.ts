import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import {
  CreateKPIVolumeDto,
  DeleteKPIVolumeDto,
  ListKpiVolumeDto,
  TemplateKpiVolumeDto,
} from './dto/kpi-volume.dto';
import { KpiVolumeService } from './kpi-volume.service';

@ApiBearerAuth()
@ApiTags('18. KPI Volume')
@Controller('kpi-volumes')
@UsePipes(new ValidationPipe({ transform: true }))
export class KpiVolumeController {
  constructor(private readonly kpiVolumeService: KpiVolumeService) {}

  @Get('template-create')
  @ApiOperation({ summary: 'Tải template KPI Volume' })
  @ActivityLog('API_KPI_LIST')
  async templateCreate(
    @Query() query: TemplateKpiVolumeDto,
    @Res() response: Response,
  ) {
    const template = await this.kpiVolumeService.templateCreate(query);
    return SendResponse.downloadExcel(
      template,
      response,
      'template-create-kpi-volume',
    );
  }

  @Get('template-delete')
  @ApiOperation({ summary: 'Tải template KPI Volume' })
  @ActivityLog('API_KPI_LIST')
  async templateDelete(
    @Query() query: TemplateKpiVolumeDto,
    @Res() response: Response,
  ) {
    const template = await this.kpiVolumeService.templateDelete(query);
    return SendResponse.downloadExcel(
      template,
      response,
      'template-delete-kpi-volume',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách KPI Volume' })
  async getAll(@Query() query: ListKpiVolumeDto) {
    const kpiVolumes = await this.kpiVolumeService.getAll(query);
    return SendResponse.success(kpiVolumes, 'Get list kpi volumes successful!');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo KPI Volume' })
  @ActivityLog('API_KPI_LIST')
  async create(@Body() body: CreateKPIVolumeDto) {
    const kpi = await this.kpiVolumeService.create(body);
    return SendResponse.success(kpi, 'Create KPI volume successful!');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa KPI Volume' })
  @ActivityLog('API_KPI_LIST')
  async delete(@Body() { id }: DeleteKPIVolumeDto) {
    await this.kpiVolumeService.delete(id);
    return SendResponse.success([], 'Delete KPI volume successful!');
  }
}
