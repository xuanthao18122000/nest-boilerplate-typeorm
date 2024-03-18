import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import {
  Area,
  Product,
  Promotion,
  PromotionArea,
  PromotionProduct,
  PromotionStaff,
  ROU,
  Staff,
  User,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  CreatePromotionDto,
  ListPromotionDto,
  RegionPromotionDto,
  UpdatePromotionDto,
} from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepo: Repository<Promotion>,

    @InjectRepository(PromotionArea)
    private promotionAreaRepo: Repository<PromotionArea>,

    @InjectRepository(PromotionStaff)
    private promotionStaffRepo: Repository<PromotionStaff>,

    @InjectRepository(PromotionProduct)
    private promotionProductRepo: Repository<PromotionProduct>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Area)
    private areaRepo: Repository<Area>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(ROU)
    private rouRepo: Repository<ROU>,
  ) {}

  async create(body: CreatePromotionDto, creator: User) {
    const {
      title,
      image,
      startDate,
      endDate,
      contentType,
      content,
      type,
      sendType,
      cost,
      attachedList,
      rouId,
      pdf,
      staffIds,
      areaIds,
      productIds,
    } = body;

    await Promise.all([
      this.checkStaffIdsExistence(staffIds),
      this.checkAreaIdsExistence(areaIds),
      this.checkProductIdsExistence(productIds),
      this.checkRouIdExistence(rouId),
    ]);

    const newPromotion = this.promotionRepo.create({
      title,
      image,
      cost,
      pdf,
      contentType,
      content,
      type,
      startDate,
      endDate,
      sendType,
      rouId,
      attachedList,
      creatorId: creator.id,
    });

    const promotion = await this.promotionRepo.save(newPromotion);

    await Promise.all([
      this.savePromotionAreas(promotion.id, areaIds),
      this.savePromotionStaffs(promotion.id, staffIds),
      this.savePromotionProducts(promotion.id, productIds),
    ]);

    return promotion.serialize();
  }

  async regionStatistics({
    rouId,
    year = moment().year(),
  }: RegionPromotionDto) {
    await this.checkRouIdExistence(rouId);

    const data = [];

    for (let i = 1; i < 13; i++) {
      const queryBuilder = this.promotionRepo
        .createQueryBuilder('promotion')
        .where('EXTRACT(MONTH FROM promotion.createdAt) = :month', {
          month: i,
        })
        .andWhere('EXTRACT(YEAR FROM promotion.createdAt) = :year', { year });

      if (rouId) {
        queryBuilder.andWhere('promotion.rouId = :rouId', { rouId });
      }

      const promotions = await queryBuilder.getMany();

      const totalCost = promotions.reduce(
        (acc, promotion) => acc + (Number(promotion.cost) || 0),
        0,
      );

      data.push({
        name: `month.${i}`,
        tons: totalCost,
        numberOfPromotion: promotions.length,
      });
    }

    return data;
  }

  async getAll(query: ListPromotionDto) {
    const entity = {
      entityRepo: this.promotionRepo,
      alias: 'promotion',
    };

    const promotions = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id'], 'promotionAreas')
      .addLeftJoinAndSelect(['id'], 'promotionStaffs')
      .addLeftJoinAndSelect(['id'], 'promotionProducts')
      .addLeftJoinAndSelect(['id', 'name'], 'area', 'promotionAreas')
      .addLeftJoinAndSelect(['id', 'fullName'], 'staff', 'promotionStaffs')
      .addLeftJoinAndSelect(['id', 'name'], 'product', 'promotionProducts')
      .addUnAccentStringForJoinedTable('promotionAreas', 'areaId')
      .addUnAccentString('title')
      .addNumber('status')
      .addNumber('cost')
      .addNumber('creatorId')
      .addNumber('rouId')
      .addNumber('id')
      .addDate('startDate', 'startDateFrom', 'startDateTo')
      .addDate('endDate', 'endDateFrom', 'endDateTo')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await promotions.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getOne(id: number) {
    return await this.findPromotionByPk(id);
  }

  async update(id: number, body: UpdatePromotionDto) {
    const { rouId, staffIds, areaIds, productIds, contentType, pdf, content } =
      body;

    if (rouId) {
      await this.checkRouIdExistence(rouId);
    }

    const promotion = await this.findPromotionByPk(id);

    const dataUpdate = new UpdateBuilder(promotion, body)
      .updateColumns([
        'title',
        'image',
        'cost',
        'type',
        'rouId',
        'startDate',
        'endDate',
        'status',
        'sendType',
        'endDate',
        'contentType',
        'attachedList',
      ])
      .getNewData();

    if (contentType === Promotion.CONTENT_TYPE.DOCS || content) {
      promotion.content = content;
      promotion.pdf = null;
    }
    if (contentType === Promotion.CONTENT_TYPE.PDF || pdf) {
      promotion.content = null;
      promotion.pdf = pdf;
    }

    const updatedPromotion = await this.promotionRepo.save(dataUpdate);

    if (staffIds) {
      await this.checkStaffIdsExistence(staffIds);

      const { staffIdsInsert, staffIdsRemove } =
        await this.getInsertAndRemoveStaffIds(id, staffIds);

      if (staffIdsInsert.length !== 0) {
        await this.insertPromotionStaffs(id, staffIdsInsert);
      }
      if (staffIdsRemove.length !== 0) {
        await this.removePromotionStaffs(id, staffIdsRemove);
      }
    }

    if (areaIds) {
      await this.checkAreaIdsExistence(areaIds);

      const { areaIdsInsert, areaIdsRemove } =
        await this.getInsertAndRemoveAreaIds(id, areaIds);

      if (areaIdsInsert.length !== 0) {
        await this.insertPromotionAreas(id, areaIdsInsert);
      }
      if (areaIdsRemove.length !== 0) {
        await this.removePromotionAreas(id, areaIdsRemove);
      }
    }

    if (productIds) {
      await this.checkProductIdsExistence(productIds);

      const { productIdsInsert, productIdsRemove } =
        await this.getInsertAndRemoveProductIds(id, productIds);

      if (productIdsInsert.length !== 0) {
        await this.insertPromotionProducts(id, productIdsInsert);
      }
      if (productIdsRemove.length !== 0) {
        await this.removePromotionProducts(id, productIdsRemove);
      }
    }

    return updatedPromotion;
  }

  async getInsertAndRemoveStaffIds(promotionId: number, staffIds: number[]) {
    const currentPromotionStaff = await this.promotionStaffRepo.find({
      where: {
        promotionId,
      },
    });

    const currentStaffIds = currentPromotionStaff.map(
      (mapping) => mapping.staffId,
    );
    const staffIdsInsert = staffIds.filter(
      (staffId) => !currentStaffIds.includes(staffId),
    );
    const staffIdsRemove = currentStaffIds.filter(
      (staffId) => !staffIds.includes(staffId),
    );

    return { staffIdsInsert, staffIdsRemove };
  }

  async insertPromotionStaffs(promotionId: number, staffIds: number[]) {
    const promotionStaffs: PromotionStaff[] = [];

    for (const staffId of staffIds) {
      const promotionStaff = this.promotionStaffRepo.create({
        promotionId,
        staffId,
      });
      promotionStaffs.push(promotionStaff);
    }

    await this.promotionStaffRepo.save(promotionStaffs);
  }

  async removePromotionStaffs(promotionId: number, staffIds: number[]) {
    const promotionStaffs = await this.promotionStaffRepo
      .createQueryBuilder('promotionStaff')
      .where('promotionStaff.promotionId = :promotionId', { promotionId })
      .andWhere('promotionStaff.staffId IN (:...staffIds)', {
        staffIds,
      })
      .getMany();

    await this.promotionStaffRepo.remove(promotionStaffs);
  }

  async getInsertAndRemoveProductIds(
    promotionId: number,
    productIds: number[],
  ) {
    const currentPromotionProducts = await this.promotionProductRepo.find({
      where: {
        promotionId,
      },
    });

    const currentProductIds = currentPromotionProducts.map(
      (mapping) => mapping.productId,
    );
    const productIdsInsert = productIds.filter(
      (productId) => !currentProductIds.includes(productId),
    );
    const productIdsRemove = currentProductIds.filter(
      (productId) => !productIds.includes(productId),
    );

    return { productIdsInsert, productIdsRemove };
  }

  async insertPromotionProducts(promotionId: number, productIds: number[]) {
    const promotionProducts: PromotionProduct[] = [];

    for (const productId of productIds) {
      const promotionProduct = this.promotionProductRepo.create({
        promotionId,
        productId,
      });
      promotionProducts.push(promotionProduct);
    }

    await this.promotionProductRepo.save(promotionProducts);
  }

  async removePromotionProducts(promotionId: number, productIds: number[]) {
    const promotionProducts = await this.promotionProductRepo
      .createQueryBuilder('promotionProduct')
      .where('promotionProduct.promotionId = :promotionId', { promotionId })
      .andWhere('promotionProduct.productId IN (:...productIds)', {
        productIds,
      })
      .getMany();

    await this.promotionProductRepo.remove(promotionProducts);
  }

  async getInsertAndRemoveAreaIds(promotionId: number, areaIds: number[]) {
    const currentPromotionAreas = await this.promotionAreaRepo.find({
      where: {
        promotionId,
      },
    });

    const currentAreaIds = currentPromotionAreas.map(
      (mapping) => mapping.areaId,
    );
    const areaIdsInsert = areaIds.filter(
      (areaId) => !currentAreaIds.includes(areaId),
    );
    const areaIdsRemove = currentAreaIds.filter(
      (areaId) => !areaIds.includes(areaId),
    );

    return { areaIdsInsert, areaIdsRemove };
  }

  async insertPromotionAreas(promotionId: number, areaIds: number[]) {
    const promotionAreas: PromotionArea[] = [];

    for (const areaId of areaIds) {
      const promotionArea = this.promotionAreaRepo.create({
        promotionId,
        areaId,
      });
      promotionAreas.push(promotionArea);
    }

    await this.promotionAreaRepo.save(promotionAreas);
  }

  async removePromotionAreas(promotionId: number, areaIds: number[]) {
    const promotionAreas = await this.promotionAreaRepo
      .createQueryBuilder('promotionArea')
      .where('promotionArea.promotionId = :promotionId', { promotionId })
      .andWhere('promotionArea.areaId IN (:...areaIds)', {
        areaIds,
      })
      .getMany();

    await this.promotionAreaRepo.remove(promotionAreas);
  }

  async findPromotionByPk(id: number) {
    const filterBuilder = new FilterBuilder({
      entityRepo: this.promotionRepo,
      alias: 'promotion',
    })
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id', 'areaId'], 'promotionAreas')
      .addLeftJoinAndSelect(['id', 'staffId'], 'promotionStaffs')
      .addLeftJoinAndSelect(['id', 'productId'], 'promotionProducts')
      .addNumber('id', id);

    const promotion = await filterBuilder.getOne();

    if (!promotion) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PROMOTION_NOT_FOUND');
    }

    const areaIds = promotion.promotionAreas.map((item) => item.areaId);
    const staffIds = promotion.promotionStaffs.map((item) => item.staffId);
    const productIds = promotion.promotionProducts.map(
      (item) => item.productId,
    );

    delete promotion.promotionAreas;
    delete promotion.promotionStaffs;
    delete promotion.promotionProducts;

    return { ...promotion, areaIds, staffIds, productIds };
  }

  async savePromotionAreas(promotionId: number, areaIds: number[]) {
    const promotionAreas: PromotionArea[] = [];

    for (const areaId of areaIds) {
      const promotionArea = this.promotionAreaRepo.create({
        areaId,
        promotionId,
      });
      promotionAreas.push(promotionArea);
    }

    await this.promotionAreaRepo.save(promotionAreas);
  }

  async savePromotionStaffs(promotionId: number, staffIds: number[]) {
    const promotionStaffs: PromotionStaff[] = [];

    for (const staffId of staffIds) {
      const promotionStaff = this.promotionStaffRepo.create({
        staffId,
        promotionId,
      });
      promotionStaffs.push(promotionStaff);
    }

    await this.promotionStaffRepo.save(promotionStaffs);
  }

  async savePromotionProducts(promotionId: number, productIds: number[]) {
    const promotionProducts: PromotionProduct[] = [];

    for (const productId of productIds) {
      const promotionProduct = this.promotionProductRepo.create({
        productId,
        promotionId,
      });
      promotionProducts.push(promotionProduct);
    }

    await this.promotionProductRepo.save(promotionProducts);
  }

  async checkRouIdExistence(rouId: number): Promise<void> {
    const rou = await this.rouRepo
      .createQueryBuilder('rou')
      .where('rou.id = :rouId', { rouId })
      .getMany();

    if (!rou) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }
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

  async checkStaffIdsExistence(staffIds: number[]): Promise<void> {
    if (staffIds.length !== 0) {
      const existingStaffs = await this.staffRepo
        .createQueryBuilder('area')
        .where('area.id IN (:...staffIds)', { staffIds })
        .getMany();

      if (existingStaffs.length !== staffIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
      }
    }
  }

  async checkAreaIdsExistence(areaIds: number[]): Promise<void> {
    if (areaIds.length !== 0) {
      const existingAreas = await this.areaRepo
        .createQueryBuilder('area')
        .where('area.id IN (:...areaIds)', { areaIds })
        .getMany();

      if (existingAreas.length !== areaIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
      }
    }
  }

  async checkAreaExistence(id: number): Promise<void> {
    const area = await this.areaRepo
      .createQueryBuilder('area')
      .where('area.id = :id', { id })
      .getOne();

    if (!area) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
    }
  }
}
