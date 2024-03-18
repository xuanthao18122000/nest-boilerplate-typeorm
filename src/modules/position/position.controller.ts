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
import { Position, User } from 'src/submodules/database/entities';
import {
  CreatePositionDto,
  ListPositionDto,
  UpdatePositionDto,
} from './dto/position.dto';
import { PositionService } from './position.service';

@ApiBearerAuth()
@ApiTags('Positions')
@Controller('positions')
@UsePipes(new ValidationPipe({ transform: true }))
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chức vụ' })
  @ActivityLog('API_POSITION_CREATE')
  async create(
    @Body() body: CreatePositionDto,
    @GetUser() creator: User,
  ): Promise<ISuccessResponse<Position>> {
    const position = await this.positionService.create(body, creator);
    return SendResponse.success(position, 'Create position successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách chức vụ' })
  @ActivityLog('API_POSITION_LIST')
  async getAll(@Query() query: ListPositionDto) {
    const positions = await this.positionService.getAll(query);
    return SendResponse.success(positions, 'Get all positions successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách chức vụ' })
  async select(@Query() query: ListPositionDto) {
    const positions = await this.positionService.getAll(query);
    return SendResponse.success(positions, 'Select positions successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật chức vụ' })
  @ActivityLog('API_POSITION_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdatePositionDto) {
    const positions = await this.positionService.update(id, body);
    return SendResponse.success(positions, 'Update position successful!');
  }
}
