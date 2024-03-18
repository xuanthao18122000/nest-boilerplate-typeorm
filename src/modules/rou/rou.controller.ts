import {
  Body,
  Controller,
  Get,
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
import { ROU, User } from 'src/submodules/database/entities';
import {
  AssignRouToProvinceDto,
  CreateROUDto,
  ListROUDto,
} from './dto/rou.dto';
import { ROUService } from './rou.service';

@ApiBearerAuth()
@ApiTags('ROUs')
@Controller('rous')
@UsePipes(new ValidationPipe({ transform: true }))
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
  @ActivityLog('API_ROU_LIST')
  async getAll(@Query() query: ListROUDto) {
    const ROUs = await this.rouService.getAll(query);
    return SendResponse.success(ROUs, 'Get all ROUs successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách ROUs' })
  @ActivityLog('API_ROU_LIST')
  async select(@Query() query: ListROUDto) {
    const ROUs = await this.rouService.getAll(query);
    return SendResponse.success(ROUs, 'Select ROUs successful!');
  }

  @Put('assign-provinces')
  @ApiOperation({ summary: 'Gán tỉnh cho ROU (Không sử dụng)' })
  async assignRouToProvince(@Body() body: AssignRouToProvinceDto) {
    const rou = await this.rouService.assignRouToProvince(body);
    return SendResponse.success(rou, 'Create rou successful!');
  }
}
