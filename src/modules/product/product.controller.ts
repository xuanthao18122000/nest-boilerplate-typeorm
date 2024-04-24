import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { User } from 'src/submodule/database/entities';
import {
  CreateProductDto,
  ListProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@ApiBearerAuth()
@ApiTags('20. Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ActivityLog('PRODUCT_CREATE')
  @ApiOperation({ summary: 'Tạo sản phẩm' })
  async create(@Body() body: CreateProductDto, @GetUser() creator: User) {
    const product = await this.productService.create(body, creator);
    return SendResponse.success(product, 'Create product successful!');
  }

  @Get()
  @ActivityLog('PRODUCT_LIST')
  @ApiOperation({ summary: 'Danh sách sản phẩm' })
  async getAll(@Query() query: ListProductDto) {
    const products = await this.productService.getAll(query);
    return SendResponse.success(products, 'Get list products successful!');
  }

  @Get(':id')
  @ActivityLog('PRODUCT_DETAIL')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  async getOne(@Param('id') id: number) {
    const product = await this.productService.getOne(id);
    return SendResponse.success(product, 'Get detail product successful!');
  }

  @Put(':id')
  @ActivityLog('PRODUCT_UPDATE')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    const product = await this.productService.update(id, body);
    return SendResponse.success(product, 'Update product successful!');
  }
}
