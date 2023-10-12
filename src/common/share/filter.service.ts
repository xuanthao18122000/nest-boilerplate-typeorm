import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseFilter } from '../share/custom-base.filter';
import { SORT_ENUM } from '../enums';

@Injectable()
export default class FilterBuilderService<T> {
  private entityName: string;
  private queryBuilder: SelectQueryBuilder<T>;
  private query: any;

  constructor(
    entityName: string,
    queryBuilder: SelectQueryBuilder<T>,
    query: any,
  ) {
    this.entityName = entityName;
    this.queryBuilder = queryBuilder;
    this.query = query;
  }

  select(selectFields: string[]) {
    const { perPage = 10, getFull = false } = this.query;
    let { page = 1 } = this.query;
    this.queryBuilder = this.queryBuilder.select(
      selectFields.map((field) => `${this.entityName}.${field}`),
    );

    if (!getFull) {
      if (page && perPage) page = (page - 1) * perPage;
      this.queryBuilder.skip(page);

      if (perPage) this.queryBuilder.take(perPage);
    }
  }

  addLikeString(name: string, value: string) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: name ? ILike(`%${value}%`) : Not(IsNull()),
    });
    return this;
  }

  addNumber(name: string, value: number) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: value ? value : Not(IsNull()),
    });
    return this;
  }

  addString(name: string, value: number) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: name ? ILike(`%${value}%`) : Not(IsNull()),
    });
    return this;
  }

  addUnAccentString(name: string, value: number) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere(
      `unaccent(LOWER(${this.entityName}.${name})) ILIKE unaccent(LOWER(:${name}))`,
      {
        [name]: `%${value}%`,
      },
    );
    return this;
  }

  addDate(dateName: string, startDate: Date, endDate: Date) {
    if (!startDate) {
      this.queryBuilder.andWhere(`${dateName} >= :startDate`, {
        startDate,
      });
    }
    if (!endDate) {
      this.queryBuilder.andWhere(`${dateName} <= :endDate`, {
        endDate,
      });
    }

    return this;
  }
}
