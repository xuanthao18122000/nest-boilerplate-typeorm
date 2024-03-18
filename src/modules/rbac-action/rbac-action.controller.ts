import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodules/common/decorators/public.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import {
  CreateMultipleRbacActions,
  CreateRbacActions,
} from './dto/rbac-action.dto';
import { RbacActionService } from './rbac-action.service';

@Public()
@ApiTags('Rbac Action')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiBearerAuth()
@Controller('rbac-actions')
export class RbacActionController {
  constructor(private readonly rbacActionService: RbacActionService) {}

  @Post()
  async create(@Body() body: CreateRbacActions) {
    const action = await this.rbacActionService.create(body);
    return SendResponse.success(action, 'Create rbac action successful!');
  }

  @Post('multiple')
  async createMulti(@Body() body: CreateMultipleRbacActions) {
    const actions = await this.rbacActionService.createMultiple(body);
    return SendResponse.success(
      actions,
      'Create multiple rbac actions successful!',
    );
  }
}
