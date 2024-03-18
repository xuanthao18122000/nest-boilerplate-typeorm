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
  CreateOtherCustomerDto,
  ListOtherCustomerDto,
  StatisticsOCsDto,
  UpdateOtherCustomerDto,
} from './dto/other-customer.dto';
import { OtherCustomerService } from './other-customer.service';

@ApiBearerAuth()
@ApiTags('9. Other Customers')
@Controller('other-customers')
@UsePipes(new ValidationPipe({ transform: true }))
export class OtherCustomerController {
  constructor(private readonly otherCustomerService: OtherCustomerService) {}

  @Get('statistics')
  @ApiOperation({ summary: `Thông kê các cửa hàng khác` })
  async contributionStatistics(@Query() query: StatisticsOCsDto) {
    const OCs = await this.otherCustomerService.statistics(query);
    return SendResponse.success(
      OCs,
      'Get statistics other customers successful!',
    );
  }

  @Post()
  @ApiOperation({ summary: 'Tạo khách hàng khác' })
  @ActivityLog('API_OTHER_CUSTOMER_CREATE')
  async create(@Body() body: CreateOtherCustomerDto, @GetUser() creator: User) {
    const otherCustomer = await this.otherCustomerService.create(body, creator);
    return SendResponse.success(
      otherCustomer,
      'Create other customer successful!',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách khách hàng khác' })
  @ActivityLog('API_OTHER_CUSTOMER_LIST')
  async getAll(@Query() query: ListOtherCustomerDto) {
    const otherCustomers = await this.otherCustomerService.getAll(query);
    return SendResponse.success(
      otherCustomers,
      'Get list other customers successful!',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khách hàng khác' })
  @ActivityLog('API_OTHER_CUSTOMER_DETAIL')
  async getOne(@Param('id') id: number) {
    const otherCustomer = await this.otherCustomerService.findOCByPk(id);
    return SendResponse.success(
      otherCustomer,
      'Get detail other customer successful!',
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật khách hàng khác' })
  @ActivityLog('API_OTHER_CUSTOMER_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdateOtherCustomerDto) {
    const otherCustomer = await this.otherCustomerService.update(id, body);
    return SendResponse.success(
      otherCustomer,
      'Update other customer successful!',
    );
  }
}
