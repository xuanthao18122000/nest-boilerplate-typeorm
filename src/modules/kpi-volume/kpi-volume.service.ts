import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import {
  getCurrentDateParts,
  setBoldAndColorCellsInRow,
} from 'src/submodules/common/utils';
import {
  KpiVolume,
  ORP,
  ORPManagement,
  ROU,
  Staff,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import {
  CreateKPIVolumeDto,
  ListKpiVolumeDto,
  TemplateKpiVolumeDto,
} from './dto/kpi-volume.dto';

@Injectable()
export class KpiVolumeService {
  constructor(
    @InjectRepository(KpiVolume)
    private kpiVolumeRepo: Repository<KpiVolume>,

    @InjectRepository(ORP)
    private orpRepo: Repository<ORP>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(ROU)
    private rouRepo: Repository<ROU>,

    @InjectRepository(ORPManagement)
    private orpManagement: Repository<ORPManagement>,

    private readonly locationService: LocationService,
  ) {}

  async getAll({ month, year }: ListKpiVolumeDto) {
    console.log(month, year);

    const query = { getFull: true };
    const entity = {
      entityRepo: this.rouRepo,
      alias: 'rou',
    };

    const ROUs = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'provinces')
      .sortBy('id');

    const [list, total] = await ROUs.getManyAndCount();
    return listResponse(list, total, query);
  }

  async templateCreate({ lang }: TemplateKpiVolumeDto) {
    console.log(lang);

    // const path = `../../i18n/${lang}.json`;
    // const relativePath = getRelativePathByLang(lang, path);

    const ODs = await this.getListODs();

    const workbook = new ExcelJS.Workbook();
    const worksheetMain = workbook.addWorksheet('Template');
    const worksheetODs = workbook.addWorksheet('OD list');

    worksheetMain.columns = [
      { header: 'No.', width: 10 },
      { header: 'OD ID', width: 20 },
      { header: 'OD number', width: 20 },
      { header: 'OD name', width: 20 },
      { header: 'ID ASE', width: 20 },
      { header: 'ASE name', width: 20 },
      { header: 'Target volume', width: 20 },
    ];
    setBoldAndColorCellsInRow(worksheetMain, 1);

    worksheetODs.columns = [
      { header: 'No.', key: 'stt', width: 10 },
      { header: 'OD ID', key: 'id', width: 20 },
      { header: 'OD number', key: 'idFico', width: 20 },
      { header: 'OD name', key: 'name', width: 25 },
      { header: 'ID ASE', key: 'managerId', width: 20 },
      { header: 'ASE name', key: 'managerName', width: 20 },
      { header: 'ROU', key: 'rou', width: 20 },
      { header: 'Province', key: 'province', width: 30 },
    ];

    ODs.forEach((od, index) => {
      worksheetODs.addRow({
        stt: index + 1,
        id: od.id,
        idFico: od.idFico,
        name: od.name,
        managerId: od.managerId,
        managerName: od.manager?.fullName,
        rou: od.rou?.name,
        province: od.province?.name,
      });
    });
    setBoldAndColorCellsInRow(worksheetODs, 1);

    return await workbook.xlsx.writeBuffer();
  }

  async templateDelete({ lang }: TemplateKpiVolumeDto) {
    console.log(lang);

    // const path = `../../i18n/${lang}.json`;
    // const relativePath = getRelativePathByLang(lang, path);

    const kpiVolumes = await this.getListKpiVolumes();

    const workbook = new ExcelJS.Workbook();
    const worksheetMain = workbook.addWorksheet('Template');
    const worksheetODs = workbook.addWorksheet('OD list');

    worksheetMain.columns = [
      { header: 'No.', width: 10 },
      { header: 'ID', key: 'id', width: 20 },
      { header: 'OD ID', width: 20 },
      { header: 'OD name', width: 20 },
      { header: 'ID ASE', width: 20 },
      { header: 'ASE name', width: 20 },
      { header: 'ROU', width: 20 },
      { header: 'Provinces', width: 30 },
      { header: 'Target volume', width: 20 },
    ];
    setBoldAndColorCellsInRow(worksheetMain, 1);

    worksheetODs.columns = [
      { header: 'No.', key: 'stt', width: 10 },
      { header: 'ID', key: 'id', width: 20 },
      { header: 'OD ID', key: 'odId', width: 20 },
      { header: 'OD name', key: 'odName', width: 20 },
      { header: 'ID ASE', key: 'staffId', width: 20 },
      { header: 'ASE name', key: 'staffName', width: 20 },
      { header: 'ROU', key: 'rou', width: 20 },
      { header: 'Provinces', key: 'provinces', width: 30 },
      { header: 'Target volume', key: 'targetVolume', width: 20 },
    ];

    for (let i = 0; i < kpiVolumes.length; i++) {
      const provinces = await this.locationService.getProvincesByIds(
        kpiVolumes[i].orpManagement.staff.provinceIds,
      );
      const provincesName = provinces
        .map((province) => province.name)
        .join(', ');

      worksheetODs.addRow({
        stt: i + 1,
        id: kpiVolumes[i].id,
        odId: kpiVolumes[i].orpManagement.orp.id,
        odName: kpiVolumes[i].orpManagement.orp.name,
        staffId: kpiVolumes[i].orpManagement.staff.id,
        staffName: kpiVolumes[i].orpManagement.staff.fullName,
        rou: kpiVolumes[i].orpManagement.staff.rou.name,
        provinces: provincesName,
        targetVolume: kpiVolumes[i].targetVolume,
      });
    }
    setBoldAndColorCellsInRow(worksheetODs, 1);

    return await workbook.xlsx.writeBuffer();
  }

  async getListODs() {
    const query = { getFull: true };
    const entity = {
      entityRepo: this.orpRepo,
      alias: 'od',
    };

    const ODs = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'manager')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addLeftJoinAndSelect(['id', 'name'], 'province')
      .addNumber('type', ORP.TYPE.OFFICIAL_DISTRIBUTOR)
      .sortBy('id');

    return await ODs.getMany();
  }

  async getListKpiVolumes() {
    const { month, year } = getCurrentDateParts();
    const query = { getFull: true };

    const entity = {
      entityRepo: this.kpiVolumeRepo,
      alias: 'kpiVolume',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'staffId', 'orpId'], 'orpManagement')
      .addLeftJoinAndSelect(['id', 'name'], 'orp', 'orpManagement')
      .addLeftJoinAndSelect(
        ['id', 'fullName', 'rouId', 'provinceIds'],
        'staff',
        'orpManagement',
      )
      .andFullWhere(
        `kpiVolume.year > :year OR (kpiVolume.year = :year AND kpiVolume.month > :month)`,
        { year, month },
      )
      .addLeftJoinAndSelect(['id', 'name'], 'rou', 'staff')
      .sortBy('id');

    return await filterBuilder.getMany();
  }

  async create(query: CreateKPIVolumeDto) {
    const { months, year, odId, staffId, targetVolume } = query;

    const orpManagement = await this.getOrpManagement(odId, staffId);

    for (const month of months) {
      let kpiVolume = await this.kpiVolumeRepo.findOneBy({
        orpManagementId: orpManagement.id,
        month,
        year,
      });

      if (!kpiVolume) {
        kpiVolume = this.kpiVolumeRepo.create({
          month,
          year,
          orpManagementId: orpManagement.id,
          targetVolume,
        });
      } else {
        kpiVolume.targetVolume = targetVolume;
      }

      await this.kpiVolumeRepo.save(kpiVolume);
    }
  }

  async delete(id: number) {
    const kpiVolume = await this.kpiVolumeRepo.findOneBy({
      id,
    });

    return await this.kpiVolumeRepo.remove(kpiVolume);
  }

  async getOrpManagement(orpId: number, staffId: number) {
    const [staff, od] = await Promise.all([
      this.staffRepo.findOneBy({ id: staffId }),
      this.orpRepo.findOneBy({ id: orpId }),
    ]);

    if (!staff) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'STAFF_NOT_FOUND');
    }

    if (!od) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'OD_NOT_FOUND');
    }

    const manage = await this.orpManagement.findOneBy({ orpId, staffId });

    if (!manage) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'STAFF_NOT_MANAGE_OD');
    }

    return manage;
  }
}
