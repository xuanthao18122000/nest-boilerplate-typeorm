import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import UpdateBuilder from 'src/submodule/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import { Product, User } from 'src/submodule/database/entities';
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
      alias,
    };
  }

  async getAll(query: ListProductDto) {
    const { brandCategory } = query;
    const entity = this.buildEntity();

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'name', 'category'], 'brand')
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addUnAccentString('name')
      .addNumber('creatorId')
      .addNumber('brandId')
      .addNumber('status')
      .addNumber('id')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    if (brandCategory) {
      filterBuilder.addNumber('category', brandCategory, 'brand');
    }

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(body: CreateProductDto, creator: User) {
    const { name } = body;
    const isExistedName = await this.productRepo.findOneBy({ name });

    if (isExistedName) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'PRODUCT_NAME_EXISTED');
    }

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
    const { name } = body;
    const product = await this.findProductByPk(id);

    if (body.brandId) {
      await this.brandService.findBrandByPk(body.brandId);
    }

    if (name) {
      const isExistedName = await this.productRepo.findOneBy({ name });

      if (isExistedName) {
        throw ErrorHttpException(HttpStatus.CONFLICT, 'PRODUCT_NAME_EXISTED');
      }
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

  async checkProductIdsExistence(productIds: number[]): Promise<void> {
    if (productIds.length !== 0) {
      const existingProducts = await this.productRepo
        .createQueryBuilder('product')
        .where('product.id IN (:...productIds)', { productIds })
        .getMany();

      if (existingProducts.length !== productIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }
    }
  }

  async getProductsByIds(productIds: number[]): Promise<Product[]> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    if (productIds) {
      queryBuilder.where('product.id IN (:...productIds)', { productIds });
    }

    const products = await queryBuilder.getMany();

    if (products.length === 0) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    return products;
  }
}
