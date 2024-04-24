export default class UpdateBuilder<
  T,
  TBody extends Partial<T> | T = Partial<T>,
> {
  private entity: T;
  private body: TBody;

  constructor(entity: T, body: TBody) {
    if (entity) {
      this.entity = entity;
      this.body = body;
    }
  }

  updateColumns(columns: (keyof T & keyof TBody)[], valueUpdate?: any): this {
    for (const column of columns) {
      const value = valueUpdate || this.body[column];

      if (typeof value !== 'undefined') {
        this.entity[column] = value;
      }
    }

    return this;
  }

  updateColumnBody(column: keyof T & keyof TBody, valueUpdate?: any): this {
    const value = valueUpdate || this.body[column];

    if (typeof value !== 'undefined') {
      this.entity[column] = value;
    }

    return this;
  }

  updateColumnWithValue(column: keyof T, valueUpdate: any): this {
    if (typeof valueUpdate !== 'undefined') {
      this.entity[column] = valueUpdate;
    }

    return this;
  }

  getNewData() {
    return this.entity;
  }
}
