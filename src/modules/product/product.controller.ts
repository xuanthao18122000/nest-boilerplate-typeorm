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
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  CreateProductDto,
  ListProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm' })
  async create(@Body() body: CreateProductDto, @GetUser() creator: User) {
    const product = await this.productService.create(body, creator);
    return SendResponse.success(product, 'Create product successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm' })
  async getAll(@Query() query: ListProductDto) {
    const products = await this.productService.getAll(query);
    return SendResponse.success(products, 'Get list products successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách sản phẩm' })
  async select(@Query() query: ListProductDto) {
    const products = await this.productService.getAll(query);
    return SendResponse.success(products, 'Select products successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  async getOne(@Param('id') id: number) {
    const product = await this.productService.getOne(id);
    return SendResponse.success(product, 'Get detail product successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    const product = await this.productService.update(id, body);
    return SendResponse.success(product, 'Update product successful!');
  }
}
