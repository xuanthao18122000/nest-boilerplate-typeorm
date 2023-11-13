import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';
import { getEnv } from 'src/configs/env.config';

@ApiTags('1. Health Check')
@Controller('ping')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Kiểm tra Server và Database' })
  checkHealth() {
    return this.healthCheckService.check([
      () => this.http.pingCheck('ping_server', getEnv('APP_URL')),
      () => this.db.pingCheck('ping_database'),
    ]);
  }
}
