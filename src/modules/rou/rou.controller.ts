import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodule/common/decorators/public.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodule/common/interfaces';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { ROU, User } from 'src/submodule/database/entities';
import {
  AssignRouToProvinceDto,
  CreateROUDto,
  ListROUDto,
} from './dto/rou.dto';
import { ROUService } from './rou.service';

@ApiBearerAuth()
@ApiTags('ROUs')
@Controller('rous')
export class ROUController {
  constructor(private readonly rouService: ROUService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ROU' })
  async create(
    @Body() body: CreateROUDto,
    @GetUser() creator: User,
  ): Promise<ISuccessResponse<ROU>> {
    const rou = await this.rouService.create(body, creator);
    return SendResponse.success(rou, 'Create rou successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách ROUs' })
  async getAll(@Query() query: ListROUDto) {
    const ROUs = await this.rouService.getAll(query);
    return SendResponse.success(ROUs, 'Get all ROUs successful!');
  }

  @Put('assign-provinces')
  @ApiOperation({ summary: 'Gán tỉnh cho ROU (FE không sử dụng API này)' })
  async assignRouToProvince(@Body() body: AssignRouToProvinceDto) {
    const rou = await this.rouService.assignRouToProvince(body);
    return SendResponse.success(rou, 'Create rou successful!');
  }

  @Get('geo-maps')
  @Public()
  @ApiOperation({ summary: 'Danh sách ROU và Provinces có tọa độ tỉnh' })
  async locationWithCoordinates() {
    const locations = await this.rouService.locationWithCoordinates();
    return SendResponse.success(locations, 'Get locations successful!');
  }
}
