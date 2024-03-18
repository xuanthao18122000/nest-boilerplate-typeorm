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
  CreateRetailerDto,
  ListRetailerDto,
  UpdateRetailerDto,
} from './dto/retailer.dto';

import { RetailerService } from './retailer.service';

@ApiBearerAuth()
@ApiTags('7. Retailers')
@Controller('retailers')
@UsePipes(new ValidationPipe({ transform: true }))
export class RetailerController {
  constructor(private readonly retailerService: RetailerService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo cửa hàng bán lẻ' })
  @ActivityLog('API_RETAILER_CREATE')
  async create(@Body() body: CreateRetailerDto, @GetUser() creator: User) {
    const retailer = await this.retailerService.create(body, creator);
    return SendResponse.success(retailer, 'Create retailer successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách cửa hàng bán lẻ' })
  @ActivityLog('API_RETAILER_LIST')
  async getAll(@Query() query: ListRetailerDto) {
    const retailers = await this.retailerService.getAll(query);
    return SendResponse.success(retailers, 'Get list retailers successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết cửa hàng bán lẻ' })
  @ActivityLog('API_RETAILER_DETAIL')
  async getOne(@Param('id') id: number) {
    const retailer = await this.retailerService.findRetailerByPk(id);
    return SendResponse.success(retailer, 'Get detail retailer successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật cửa hàng bán lẻ' })
  @ActivityLog('API_RETAILER_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdateRetailerDto) {
    const retailer = await this.retailerService.update(id, body);
    return SendResponse.success(retailer, 'Update retailer successful!');
  }
}
