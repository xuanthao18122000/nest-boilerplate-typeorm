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
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  CreatePromotionDto,
  ListPromotionDto,
  RegionPromotionDto,
  UpdatePromotionDto,
} from './dto/promotion.dto';
import { PromotionService } from './promotion.service';

@ApiBearerAuth()
@ApiTags('13. Promotions')
@Controller('promotions')
@UsePipes(new ValidationPipe({ transform: true }))
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chương trình khuyến mãi' })
  @ActivityLog('API_PROMOTION_CREATE')
  async create(@Body() body: CreatePromotionDto, @GetUser() creator: User) {
    const promotion = await this.promotionService.create(body, creator);
    return SendResponse.success(promotion, 'Create promotion successful!');
  }

  @Get('region/statistics')
  @ApiOperation({ summary: 'Thông kê số lượng khuyến mãi theo khu vực' })
  async regionStatistics(@Query() query: RegionPromotionDto) {
    const promotion = await this.promotionService.regionStatistics(query);
    return SendResponse.success(
      promotion,
      'Get statistics number of promotion by region successful!',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách chương trình khuyến mãi' })
  @ActivityLog('API_PROMOTION_LIST')
  async getAll(@Query() query: ListPromotionDto) {
    const promotions = await this.promotionService.getAll(query);
    return SendResponse.success(promotions, 'Get list promotions successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết chương trình khuyến mãi' })
  @ActivityLog('API_PROMOTION_DETAIL')
  async getOne(@Param('id') id: number) {
    const promotion = await this.promotionService.getOne(id);
    return SendResponse.success(promotion, 'Get detail promotion successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật chương trình khuyến mãi' })
  @ActivityLog('API_PROMOTION_UPDATE')
  async update(@Param('id') id: number, @Body() body: UpdatePromotionDto) {
    const promotion = await this.promotionService.update(id, body);
    return SendResponse.success(promotion, 'Update promotion successful!');
  }
}
