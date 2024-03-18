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
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  ListPCDto,
  StatisticsPCsDto,
  UpdatePCDto,
} from './dto/potential-customer.dto';
import { PotentialCustomerService } from './potential-customer.service';

@ApiBearerAuth()
@ApiTags('8. Potential Customer')
@Controller('potential-customers')
@UsePipes(new ValidationPipe({ transform: true }))
export class PotentialCustomerController {
  constructor(
    private readonly potentialCustomerService: PotentialCustomerService,
  ) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Thống kê tác vụ theo tỉnh' })
  async statistics(@Query() query: StatisticsPCsDto) {
    const statistics = await this.potentialCustomerService.statisticsPCs(query);
    return SendResponse.success(statistics, 'Get statistics tasks successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách cửa hàng tiềm năng' })
  @ActivityLog('API_POTENTIAL_LIST')
  async getAll(@Query() query: ListPCDto) {
    const PCs = await this.potentialCustomerService.getAll(query);
    return SendResponse.success(PCs, 'Get list potential customer successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết cửa hàng tiềm năng' })
  @ActivityLog('API_POTENTIAL_DETAIL')
  async getOne(@Param('id') id: number) {
    const pc = await this.potentialCustomerService.getOne(id);
    return SendResponse.success(
      pc,
      'Get detail potential customer successful!',
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật cửa hàng tiềm năng' })
  @ActivityLog('API_POTENTIAL_UPDATE')
  async update(
    @Param('id') id: number,
    @Body() body: UpdatePCDto,
    @GetUser() updater: User,
  ) {
    const pc = await this.potentialCustomerService.update(id, body, updater);
    return SendResponse.success(pc, 'Update potential customer successful!');
  }
}
