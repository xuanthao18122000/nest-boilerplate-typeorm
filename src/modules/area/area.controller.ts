import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodules/common/interfaces';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { Area, User } from 'src/submodules/database/entities';
import { AreaService } from './area.service';
import { CreateAreaDto, ListAreaDto, UpdateAreaDto } from './dto/area.dto';

@ApiBearerAuth()
@ApiTags('Areas')
@Controller('areas')
@UsePipes(new ValidationPipe({ transform: true }))
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo khu vực' })
  @ActivityLog('API_AREA_CREATE')
  async create(
    @Body() body: CreateAreaDto,
    @GetUser() creator: User,
  ): Promise<ISuccessResponse<Area>> {
    const area = await this.areaService.create(body, creator);
    return SendResponse.success(area, 'Create area successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách khu vực' })
  @ActivityLog('API_AREA_LIST')
  async getAll(@Query() query: ListAreaDto) {
    const areas = await this.areaService.getAll(query);
    return SendResponse.success(areas, 'Get all areas successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Select danh sách khu vực' })
  async select(@Query() query: ListAreaDto) {
    const areas = await this.areaService.getAll(query);
    return SendResponse.success(areas, 'Select areas successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khu vực' })
  @ActivityLog('API_AREA_DETAIL')
  async getOne(@Param('id') id: number) {
    const areas = await this.areaService.getOne(id);
    return SendResponse.success(areas, 'Get detail area successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật khu vực' })
  @ActivityLog('API_AREA_UPDATE')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateAreaDto,
    @GetUser() updater: User,
  ) {
    const areas = await this.areaService.update(id, body, updater);
    return SendResponse.success(areas, 'Update area successful!');
  }
}
