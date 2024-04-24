import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodule/common/decorators/public.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import {
  CreateMultipleRbacActions,
  CreateRbacActions,
} from './dto/rbac-action.dto';
import { RbacActionService } from './rbac-action.service';

@Public()
@ApiTags('Rbac Action')
@ApiBearerAuth()
@Controller('rbac-actions')
export class RbacActionController {
  constructor(private readonly rbacActionService: RbacActionService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo single permission action (FE Không sử dụng API này)',
  })
  async create(@Body() body: CreateRbacActions) {
    const action = await this.rbacActionService.create(body);
    return SendResponse.success(action, 'Create rbac action successful!');
  }

  @Post('multiple')
  @ApiOperation({
    summary: 'Tạo multiple permission actions (FE Không sử dụng API này)',
  })
  async createMulti(@Body() body: CreateMultipleRbacActions) {
    const actions = await this.rbacActionService.createMultiple(body);
    return SendResponse.success(
      actions,
      'Create multiple rbac actions successful!',
    );
  }
}
