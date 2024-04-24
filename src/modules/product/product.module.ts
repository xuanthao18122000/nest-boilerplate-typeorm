import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Product } from 'src/submodule/database/entities';
import { BrandService } from '../brand/brand.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand])],
  controllers: [ProductController],
  providers: [ProductService, BrandService],
  exports: [ProductService],
})
export class ProductModule {}
