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
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  ContributionODDto,
  CreateODDto,
  ListODDto,
  RegionODDto,
  UpdateODDto,
} from './dto/official-distributor.dto';
import { ODService } from './official-distributor.service';

@ApiBearerAuth()
@ApiTags('6. Official Distributors')
@Controller('official-distributors')
@UsePipes(new ValidationPipe({ transform: true }))
export class ODController {
  constructor(private readonly odService: ODService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhà phân phối' })
  @ActivityLog('API_OD_CREATE')
  async create(@Body() body: CreateODDto, @GetUser() creator: User) {
    const OD = await this.odService.create(body, creator);
    return SendResponse.success(OD, 'Create official distributor successful!');
  }

  @Get('contribution/statistics')
  @ApiOperation({ summary: `Thông kê OD contribution - OD's type` })
  async contributionStatistics(@Query() query: ContributionODDto) {
    const ODs = await this.odService.contributionStatistics(query);
    return SendResponse.success(
      ODs,
      'Get statistics official distributors contribution successful!',
    );
  }

  @Get('region/statistics')
  @ApiOperation({ summary: 'Thông kê số lượng ODs theo khu vực' })
  async regionStatistics(@Query() query: RegionODDto) {
    const ODs = await this.odService.regionStatistics(query);
    return SendResponse.success(
      ODs,
      'Get statistics number of ODs by region successful!',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách nhà phân phối' })
  @ActivityLog('API_OD_LIST')
  async getAll(@Query() query: ListODDto) {
    const ODs = await this.odService.getAll(query);
    return SendResponse.success(
      ODs,
      'Get list official distributors successful!',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhà phân phối' })
  @ActivityLog('API_OD_DETAIL')
  async getOne(@Param('id') id: number) {
    const OD = await this.odService.getOne(id);
    return SendResponse.success(
      OD,
      'Get detail official distributor successful!',
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật nhà phân phối' })
  @ActivityLog('API_OD_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdateODDto) {
    const OD = await this.odService.update(id, body);
    return SendResponse.success(OD, 'Update official distributor successful!');
  }
}
