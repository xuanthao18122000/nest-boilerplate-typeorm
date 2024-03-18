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
import { Public } from 'src/submodules/common/decorators/public.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { CreateRolesDto, ListRolesDto, UpdateRolesDto } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('4. Roles')
@Controller('roles')
@UsePipes(new ValidationPipe({ transform: true }))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo Role' })
  async createRole(@Body() body: CreateRolesDto) {
    const role = await this.roleService.create(body);
    return SendResponse.success(role, 'Create roles successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách Roles' })
  async listRoles(@Query() query: ListRolesDto) {
    const roles = await this.roleService.getAll(query);
    return SendResponse.success(roles, 'Get list roles successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách Roles' })
  async select(@Query() query: ListRolesDto) {
    const roles = await this.roleService.getAll(query);
    return SendResponse.success(roles, 'Select roles successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết Role' })
  async getOne(@Param('id') id: number) {
    const roles = await this.roleService.getOne(id);
    return SendResponse.success(roles, 'Get detail role successful!');
  }

  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật Role' })
  async update(@Body() body: UpdateRolesDto, @Param('id') id: number) {
    const role = await this.roleService.update(id, body);
    return SendResponse.success(role, 'Update role successful!');
  }
}
