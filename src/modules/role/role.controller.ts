import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { CreateRolesDto, ListRolesDto, UpdateRolesDto } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('4. Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ActivityLog('PERMISSION_CREATE')
  @ApiOperation({ summary: 'Tạo Role' })
  async createRole(@Body() body: CreateRolesDto) {
    const role = await this.roleService.create(body);
    return SendResponse.success(role, 'Create roles successful!');
  }

  @Get()
  @ActivityLog('PERMISSION_LIST')
  @ApiOperation({ summary: 'Danh sách Roles' })
  async listRoles(@Query() query: ListRolesDto) {
    const roles = await this.roleService.getAll(query);
    return SendResponse.success(roles, 'Get list roles successful!');
  }

  @Get(':id')
  @ActivityLog('PERMISSION_DETAIL')
  @ApiOperation({ summary: 'Chi tiết Role' })
  async getOne(@Param('id') id: number) {
    const roles = await this.roleService.getOne(id);
    return SendResponse.success(roles, 'Get detail role successful!');
  }

  @Put(':id')
  @ActivityLog('PERMISSION_UPDATE')
  @ApiOperation({ summary: 'Cập nhật Role' })
  async update(@Body() body: UpdateRolesDto, @Param('id') id: number) {
    const role = await this.roleService.update(id, body);
    return SendResponse.success(role, 'Update role successful!');
  }
}
