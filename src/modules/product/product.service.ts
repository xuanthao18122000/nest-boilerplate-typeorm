import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Product, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { BrandService } from '../brand/brand.service';
import {
  CreateProductDto,
  ListProductDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly brandService: BrandService,
  ) {}

  private buildEntity(alias: string = 'product') {
    return {
      entityRepo: this.productRepo,
      alias: alias,
    };
  }

  async getAll(query: ListProductDto) {
    const entity = this.buildEntity();

    const products = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'name'], 'brand')
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addUnAccentString('name')
      .addNumber('creatorId')
      .addNumber('brandId')
      .addNumber('status')
      .addNumber('id')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await products.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(body: CreateProductDto, creator: User) {
    await this.brandService.findBrandByPk(body.brandId);

    const newProduct = this.productRepo.create({
      ...body,
      creatorId: creator.id,
    });

    const product = await this.productRepo.save(newProduct);
    return product;
  }

  async getOne(id: number) {
    return await this.findProductByPk(id);
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.findProductByPk(id);

    if (body.brandId) {
      await this.brandService.findBrandByPk(body.brandId);
    }

    const dataUpdate = new UpdateBuilder(product, body)
      .updateColumns(['name', 'brandId', 'status', 'avatar', 'images', 'note'])
      .getNewData();

    return await this.productRepo.save(dataUpdate);
  }

  async findProductByPk(id: number) {
    const entity = this.buildEntity();

    const product = new FilterBuilder(entity)
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addNumber('id', id)
      .getOne();

    if (!product) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    return product;
  }
}
