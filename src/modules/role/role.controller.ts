import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendResponse } from 'src/common/response/send-response';

import { Public } from 'src/common/decorators/public.decorator';
import { CreateRolesDto } from './dto/create-roles.dto';
import { ListRolesDto } from './dto/list-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { RoleService } from './role.service';

@ApiTags('4. Roles')
@Controller('roles')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create Role' })
  async createRole(@Body() body: CreateRolesDto) {
    const role = await this.roleService.create(body);
    return SendResponse.success(role, 'Create roles successful!');
  }

  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Update Role' })
  async updateRole(@Body() body: UpdateRolesDto, @Param('id') id: number) {
    const role = await this.roleService.updateRole(id, body);
    return SendResponse.success(role, 'Update role successful!');
  }

  @Get('')
  @ApiOperation({ summary: 'List Roles' })
  async listRoles(@Query() query: ListRolesDto) {
    const roles = await this.roleService.getAll(query);
    return SendResponse.success(roles, 'Get list roles successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail Role' })
  async detailRole(@Param('id') id: number) {
    const roles = await this.roleService.getOne(id);
    return SendResponse.success(roles, 'Get details role successful!');
  }
}
