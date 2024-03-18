import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodules/common/decorators/public.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import {
  CreateMultipleRbacModules,
  CreateRbacModules,
  ListRbacModulesDto,
} from './dto/rbac-module.dto';
import { RbacModuleService } from './rbac-module.service';

@Public()
@ApiTags('Rbac Modules')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiBearerAuth()
@Controller('rbac-modules')
export class RbacModuleController {
  constructor(private readonly rbacModuleService: RbacModuleService) {}

  @Get()
  async getAll(@Query() query: ListRbacModulesDto) {
    const modules = await this.rbacModuleService.getAll(query);
    return SendResponse.success(modules, 'Get rbac modules successful!');
  }

  @Post()
  async create(@Body() body: CreateRbacModules) {
    const module = await this.rbacModuleService.create(body);
    return SendResponse.success(module, 'Create rbac module successful!');
  }

  @Post('multiple')
  async createulti(@Body() body: CreateMultipleRbacModules) {
    await this.rbacModuleService.createMultiple(body);
    return SendResponse.success([], 'Create multiple rbac modules successful!');
  }
}
