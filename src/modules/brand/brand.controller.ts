import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { User } from 'src/submodule/database/entities';
import { BrandService } from './brand.service';
import { CreateBrandDto, ListBrandDto, UpdateBrandDto } from './dto/brand.dto';

@ApiBearerAuth()
@ApiTags('21. Brand')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ActivityLog('BRAND_CREATE')
  @ApiOperation({ summary: 'Tạo thương hiệu' })
  async create(@Body() body: CreateBrandDto, @GetUser() creator: User) {
    const brand = await this.brandService.create(body, creator);
    return SendResponse.success(brand, 'Create brand successful!');
  }

  @Get()
  @ActivityLog('BRAND_LIST')
  @ApiOperation({ summary: 'Danh sách thương hiệu' })
  async getAll(@Query() query: ListBrandDto) {
    const brands = await this.brandService.getAll(query);
    return SendResponse.success(brands, 'Get list brands successful!');
  }

  @Get(':id')
  @ActivityLog('BRAND_DETAIL')
  @ApiOperation({ summary: 'Chi tiết thương hiệu' })
  async getOne(@Param('id') id: number) {
    const brand = await this.brandService.getOne(id);
    return SendResponse.success(brand, 'Get detail brand successful!');
  }

  @Put(':id')
  @ActivityLog('BRAND_UPDATE')
  @ApiOperation({ summary: 'Cập nhật thương hiệu' })
  async update(@Param('id') id: number, @Body() body: UpdateBrandDto) {
    const brand = await this.brandService.update(id, body);
    return SendResponse.success(brand, 'Update brand successful!');
  }
}
