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
import { AppVersion, User } from 'src/submodules/database/entities';
import { AppVersionService } from './app-version.service';
import { CreateVersionDto, HistoryVersionDto } from './dto/app-version.dto';

@ApiBearerAuth()
@ApiTags('17. App Version')
@Controller('app-versions')
@UsePipes(new ValidationPipe({ transform: true }))
export class AppVersionController {
  constructor(private readonly versionService: AppVersionService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách lịch sử Version' })
  @ActivityLog('API_VERSION_HISTORY')
  async getHistoryVersion(@Query() query: HistoryVersionDto) {
    const version = await this.versionService.getHistoryVersion(query);
    return SendResponse.success(version, 'Get detail version successful!');
  }

  @Get(':platform')
  @ApiOperation({
    summary: 'Chi tiết version',
    description:
      'Platform = ' + `${JSON.stringify(AppVersion.PLATFORM, null, '\t')}`,
  })
  @ActivityLog('API_VERSION_DETAIL')
  async getOne(@Param('platform') platform: string) {
    const version = await this.versionService.getOne(platform);
    return SendResponse.success(version, 'Get detail version successful!');
  }

  @Put()
  @ApiOperation({ summary: 'Cập nhật version' })
  @ActivityLog('API_VERSION_UPDATE')
  async update(@Body() body: CreateVersionDto, @GetUser() creator: User) {
    const version = await this.versionService.update(body, creator);
    return SendResponse.success(version, 'Update version successful!');
  }
}
