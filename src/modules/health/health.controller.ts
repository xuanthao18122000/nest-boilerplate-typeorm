import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodule/common/decorators/public.decorator';

@ApiTags('1. Health Check')
@Controller('ping')
export class HealthController {
  constructor() {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Kiểm tra Server và Database' })
  checkHealth() {
    return {
      status: 'OK',
      success: true,
      msg: 'Ping to server successful!',
    };
  }
}
