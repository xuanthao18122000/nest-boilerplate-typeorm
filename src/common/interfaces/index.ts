interface IDateQuery {
  dateName: string;
  startDateField: string;
  endDateField: string;
}

interface IQueryBuilder {
  selectFields: string[];
  unaccentFields: string[];
  numberFields: number[];
  stringFields: string[];
  dateFields: IDateQuery;
  sortName: string;
}

export { IQueryBuilder, IDateQuery };
