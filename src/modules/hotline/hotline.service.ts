import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotline } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { CreateHotline } from './dto/hotline.dto';

@Injectable()
export class HotlineService {
  constructor(
    @InjectRepository(Hotline)
    private readonly hotlineRepo: Repository<Hotline>,
  ) {}

  async create({ phoneNumber }: CreateHotline) {
    const hotlines = await this.hotlineRepo.find();
    if (hotlines.length !== 0) {
      await this.updateOldHotlineToInactive(hotlines);
    }

    const hotline = this.hotlineRepo.create({ phoneNumber });
    return await this.hotlineRepo.save(hotline);
  }

  async getHotline() {
    return await this.hotlineRepo
      .createQueryBuilder('hotline')
      .where('hotline.status = :status', { status: Hotline.STATUS.ACTIVE })
      .getOne();
  }

  async updateOldHotlineToInactive(hotlines: Hotline[]) {
    const hotlineIds = hotlines.map((hotline) => hotline.id);

    await this.hotlineRepo
      .createQueryBuilder()
      .update(Hotline)
      .set({ status: Hotline.STATUS.INACTIVE })
      .whereInIds(hotlineIds)
      .execute();
  }
}
