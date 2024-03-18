import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { IRejectInfo } from 'src/submodules/common/interfaces';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import {
  getPreviousMonthAndYear,
  sendNotificationToStaff,
} from 'src/submodules/common/utils';
import {
  ORP,
  ORPManagement,
  Staff,
  User,
} from 'src/submodules/database/entities';
import { Potential } from 'src/submodules/database/entities/potentital.entity';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import {
  ListPCDto,
  StatisticsPCsDto,
  UpdatePCDto,
} from './dto/potential-customer.dto';
@Injectable()
export class PotentialCustomerService {
  constructor(
    @InjectRepository(Potential)
    private potentialRepo: Repository<Potential>,

    @InjectRepository(ORP)
    private orpRepo: Repository<ORP>,

    @InjectRepository(ORPManagement)
    private orpManagementRepo: Repository<ORPManagement>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    private readonly locationService: LocationService,
  ) {}

  async getAll(query: ListPCDto) {
    const entity = {
      entityRepo: this.potentialRepo,
      alias: 'pc',
    };

    const PCs = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addUnAccentString('longName')
      .addUnAccentString('shortName')
      .addString('phoneNumber')
      .addNumber('provinceId')
      .addNumber('creatorId')
      .addNumber('area')
      .addNumber('category')
      .addNumber('status')
      .addNumber('size')
      .addNumber('odId')
      .addNumber('rouId')
      .addNumber('id')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await PCs.getManyAndCount();
    return listResponse(list, total, query);
  }

  async statisticsPCs({
    rouId,
    month = moment().month() + 1,
    year = moment().year(),
  }: StatisticsPCsDto) {
    const { previousMonth, previousYear } = getPreviousMonthAndYear(
      month,
      year,
    );

    const [totalPreMonth, total, waiting, confirm, reject] = await Promise.all([
      this.getNumberPCsInMonth(previousMonth, previousYear),
      this.getNumberPCsInMonth(month, year),
      this.getSummaryPCs(Potential.STATUS.WAITING, month, year),
      this.getSummaryPCs(Potential.STATUS.CONFIRM, month, year),
      this.getSummaryPCs(Potential.STATUS.REJECT, month, year),
    ]);

    const growth =
      totalPreMonth === 0 ? 0 : ((total - totalPreMonth) / totalPreMonth) * 100;

    const provinces = await this.locationService.getProvinceByRouId(rouId);
    const statisticsProvinces = [];
    const types = [ORP.TYPE.OFFICIAL_DISTRIBUTOR, ORP.TYPE.RETAILER];

    for (const province of provinces) {
      const { totalOR, newInMonth, growth, waiting, reject } =
        await this.getDataORPs(types, month, year, province.id);
      statisticsProvinces.push({
        ...province,
        growth,
        totalOR,
        newInMonth,
        waiting,
        reject,
      });
    }

    return {
      summary: {
        total,
        growth,
        waiting,
        confirm,
        reject,
      },
      statisticsProvinces,
    };
  }

  async getSummaryPCs(status: number, month: number, year: number) {
    return this.potentialRepo
      .createQueryBuilder('potential')
      .andWhere('potential.status = :status', { status })
      .andWhere('EXTRACT(MONTH FROM potential.createdAt) = :month', {
        month,
      })
      .andWhere('EXTRACT(YEAR FROM potential.createdAt) = :year', {
        year,
      })
      .getCount();
  }

  async getNumberPCsInMonth(month: number, year: number) {
    return this.potentialRepo
      .createQueryBuilder('potential')
      .andWhere('EXTRACT(MONTH FROM potential.createdAt) = :month', {
        month,
      })
      .andWhere('EXTRACT(YEAR FROM potential.createdAt) = :year', {
        year,
      })
      .getCount();
  }

  async getDataORPs(
    types: number[],
    month: number,
    year: number,
    provinceId: number,
  ) {
    const { previousMonth, previousYear } = getPreviousMonthAndYear(
      month,
      year,
    );

    const [totalOR, newInMonth, totalPreMonth, waiting, reject] =
      await Promise.all([
        this.potentialRepo
          .createQueryBuilder('orp')
          .where('orp.provinceId = :provinceId', { provinceId })
          .andWhere('orp.status IN (:...types)', { types })
          .getCount(),
        this.potentialRepo
          .createQueryBuilder('orp')
          .where('orp.provinceId = :provinceId', { provinceId })
          .andWhere('orp.status IN (:...types)', { types })
          .andWhere('EXTRACT(MONTH FROM orp.createdAt) = :month', {
            month,
          })
          .andWhere('EXTRACT(YEAR FROM orp.createdAt) = :year', {
            year,
          })
          .getCount(),
        this.potentialRepo
          .createQueryBuilder('orp')
          .where('orp.provinceId = :provinceId', { provinceId })
          .andWhere('orp.status IN (:...types)', { types })
          .andWhere('EXTRACT(MONTH FROM orp.createdAt) = :previousMonth', {
            previousMonth,
          })
          .andWhere('EXTRACT(YEAR FROM orp.createdAt) = :previousYear', {
            previousYear,
          })
          .getCount(),
        this.potentialRepo
          .createQueryBuilder('orp')
          .where('orp.provinceId = :provinceId', { provinceId })
          .andWhere('orp.status = :status', {
            status: Potential.STATUS.WAITING,
          })
          .getCount(),
        this.potentialRepo
          .createQueryBuilder('orp')
          .where('orp.provinceId = :provinceId', { provinceId })
          .andWhere('orp.status = :status', { status: Potential.STATUS.REJECT })
          .getCount(),
      ]);

    const growth =
      totalPreMonth === 0
        ? 0
        : ((newInMonth - totalPreMonth) / totalPreMonth) * 100;

    return { totalOR, newInMonth, growth, waiting, reject };
  }

  async getOne(id: number) {
    const pc = await this.findPCByPk(id);
    return pc;
  }

  async update(id: number, body: UpdatePCDto, updater: User) {
    const { status, rejectReason } = body;
    const pc = await this.findPCByPk(id);

    if (pc.status !== Potential.STATUS.WAITING) {
      throw ErrorHttpException(HttpStatus.BAD_REQUEST, 'BAD_REQUEST');
    }

    const dataUpdate = new UpdateBuilder(pc, body).updateColumns(['status']);

    if (status === Potential.STATUS.REJECT) {
      const rejectInfo = {
        rejectedById: updater.id,
        rejectedBy: updater.fullName,
        rejectReason: rejectReason,
      };

      dataUpdate.updateColumnWithValue('rejectInfo', rejectInfo);
      this.sendNotifyToStaff(rejectInfo, pc);
    }

    const updatedPC = await this.potentialRepo.save(dataUpdate.getNewData());

    if (status === Potential.STATUS.CONFIRM) {
      const pcClone = { ...pc };
      await this.becomeODRetailer(pcClone);
    }

    return updatedPC;
  }

  async sendNotifyToStaff(
    { rejectedBy, rejectReason }: IRejectInfo,
    pc: Potential,
  ) {
    const { firebaseToken } = await this.staffRepo.findOneBy({
      id: pc.creatorId,
    });

    if (firebaseToken) {
      const payload = {
        firebaseToken,
        title: 'Từ chối cửa hàng tiềm năng',
        shortBody: `${rejectedBy} đã từ chối cửa hàng ${pc.shortName} với lý do ${rejectReason}`,
      };

      sendNotificationToStaff(payload);
    }
  }

  async becomeODRetailer(pc: Partial<Potential>) {
    const type =
      pc.category === Potential.CATEGORY_POTENTIAL.OFFICIAL_DISTRIBUTOR
        ? ORP.TYPE.OFFICIAL_DISTRIBUTOR
        : ORP.TYPE.RETAILER;

    const OR = this.orpRepo.create({
      name: pc.shortName,
      contactKey: pc.contactKey,
      category: pc.category,
      images: pc.images,
      lat: pc.lat,
      lng: pc.lng,
      volume: pc.volume,
      phoneNumber: pc.phoneNumber,
      size: pc.size,
      status: ORP.STATUS.ACTIVE,
      type,
      rouId: pc.rouId,
      provinceId: pc.provinceId,
      areaId: pc.areaId,
      districtId: pc.districtId,
      wardId: pc.wardId,
      address: pc.address,
    });

    const newOR = await this.orpRepo.save(OR);

    const magager = this.orpManagementRepo.create({
      orpId: newOR.id,
      staffId: pc.creatorId,
    });

    await this.orpManagementRepo.save(magager);
  }

  async findPCByPk(id: number) {
    const pc = await this.potentialRepo
      .createQueryBuilder('pc')
      .select(['pc', 'creator.id', 'creator.fullName', 'rou.id', 'rou.name'])
      .leftJoin('pc.creator', 'creator')
      .leftJoin('pc.rou', 'rou')
      .where('pc.id = :id', { id })
      .getOne();

    if (!pc) {
      throw ErrorHttpException(
        HttpStatus.NOT_FOUND,
        'POTENTIAL_CUSTOMER_NOT_FOUND',
      );
    }

    return pc;
  }
}
