import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/submodules/common/decorators/public.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { CreateHotline } from './dto/hotline.dto';
import { HotlineService } from './hotline.service';

@ApiBearerAuth()
@ApiTags('Hotline')
@Controller('hotline')
@UsePipes(new ValidationPipe({ transform: true }))
export class HotlineController {
  constructor(private readonly hotlineService: HotlineService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Tạo số điện thoại Hotline (Không sử dụng API này)',
  })
  async create(@Body() body: CreateHotline) {
    const hotline = await this.hotlineService.create(body);
    return SendResponse.success(hotline, 'Create hotline successful!');
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy số điện thoại Hotline' })
  async getHotline() {
    const hotline = await this.hotlineService.getHotline();
    return SendResponse.success(hotline, 'Get hotline successful!');
  }
}
