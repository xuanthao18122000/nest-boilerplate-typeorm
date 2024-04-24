import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodule/common/decorators/public.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import {
  CreateMultipleRbacModules,
  CreateRbacModules,
  ListRbacModulesDto,
} from './dto/rbac-module.dto';
import { RbacModuleService } from './rbac-module.service';

@Public()
@ApiTags('Rbac Modules')
@ApiBearerAuth()
@Controller('rbac-modules')
export class RbacModuleController {
  constructor(private readonly rbacModuleService: RbacModuleService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách permission Modules' })
  async getAll(@Query() query: ListRbacModulesDto) {
    const modules = await this.rbacModuleService.getAll(query);
    return SendResponse.success(modules, 'Get rbac modules successful!');
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo single permission module (FE Không sử dụng API này)',
  })
  async create(@Body() body: CreateRbacModules) {
    const module = await this.rbacModuleService.create(body);
    return SendResponse.success(module, 'Create rbac module successful!');
  }

  @Post('multiple')
  @ApiOperation({
    summary: 'Tạo multiple permission module (FE Không sử dụng API này)',
  })
  async createMultiple(@Body() body: CreateMultipleRbacModules) {
    await this.rbacModuleService.createMultiple(body);
    return SendResponse.success([], 'Create multiple rbac modules successful!');
  }
}
