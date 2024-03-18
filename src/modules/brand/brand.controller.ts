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
import { BrandService } from './brand.service';
import { CreateBrandDto, ListBrandDto, UpdateBrandDto } from './dto/brand.dto';

@ApiBearerAuth()
@ApiTags('Brand')
@Controller('brands')
@UsePipes(new ValidationPipe({ transform: true }))
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thương hiệu' })
  async create(@Body() body: CreateBrandDto, @GetUser() creator: User) {
    const brand = await this.brandService.create(body, creator);
    return SendResponse.success(brand, 'Create brand successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách thương hiệu' })
  async getAll(@Query() query: ListBrandDto) {
    const brands = await this.brandService.getAll(query);
    return SendResponse.success(brands, 'Get list brands successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách thương hiệu' })
  async select(@Query() query: ListBrandDto) {
    const brands = await this.brandService.getAll(query);
    return SendResponse.success(brands, 'Select brands successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết thương hiệu' })
  async getOne(@Param('id') id: number) {
    const brand = await this.brandService.getOne(id);
    return SendResponse.success(brand, 'Get detail brand successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thương hiệu' })
  async update(@Param('id') id: number, @Body() body: UpdateBrandDto) {
    const brand = await this.brandService.update(id, body);
    return SendResponse.success(brand, 'Update brand successful!');
  }
}
