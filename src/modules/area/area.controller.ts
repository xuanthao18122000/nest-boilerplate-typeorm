import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { User } from 'src/submodule/database/entities';
import { AreaService } from './area.service';
import {
  CreateAreaDto,
  ListAreaDto,
  StatisticsAreaDto,
  UpdateAreaDto,
} from './dto/area.dto';

@ApiBearerAuth()
@ApiTags('23. Areas')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Biểu đồ thống kê khu vực' })
  async getUserActivities(@Query() query: StatisticsAreaDto) {
    const statistic = await this.areaService.getStatistics(query);
    return SendResponse.success(statistic, 'Get statistics areas successful!');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo khu vực' })
  @ActivityLog('AREA_CREATE')
  async create(@Body() body: CreateAreaDto, @GetUser() creator: User) {
    const area = await this.areaService.create(body, creator);
    return SendResponse.success(area, 'Create area successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách khu vực' })
  @ActivityLog('AREA_LIST')
  async getAll(@Query() query: ListAreaDto) {
    const areas = await this.areaService.getAll(query);
    return SendResponse.success(areas, 'Get all areas successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khu vực' })
  @ActivityLog('AREA_DETAIL')
  async getOne(@Param('id') id: number) {
    const areas = await this.areaService.getOne(id);
    return SendResponse.success(areas, 'Get detail area successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật khu vực' })
  @ActivityLog('AREA_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdateAreaDto) {
    const areas = await this.areaService.update(id, body);
    return SendResponse.success(areas, 'Update area successful!');
  }
}
