import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';

export default class FilterBuilder<T> {
  private entityName: string;
  public queryBuilder: SelectQueryBuilder<T>;
  private query: any;
  private entityRepo: Repository<T>;

  constructor(query: any, entityRepo: Repository<T>) {
    this.query = query;
    this.entityRepo = entityRepo;
  }

  createQueryBuilder(entityName: string) {
    this.entityName = entityName;
    this.queryBuilder = this.entityRepo.createQueryBuilder(entityName);
    return this
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
    return this.queryBuilder;
  }

  addNumber(name: string, value: number = undefined) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: value ? value : Not(IsNull()),
    });
    return this
  }

  addString(name: string, value: number) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: name ? ILike(`%${value}%`) : Not(IsNull()),
    });
    return this;
  }

  public addUnAccentString(name: string, value: string = undefined) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere(
      `unaccent(LOWER(${this.entityName}.${name})) ILIKE unaccent(LOWER(:${name}))`,
      {
        [name]: `%${value}%`,
      },
    )
    return this
  }

  addDate(
    dateName: string,
    startDate: Date = undefined,
    endDate: Date = undefined,
  ) {
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
