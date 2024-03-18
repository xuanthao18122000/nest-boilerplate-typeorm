import * as moment from 'moment';

export const getCurrentDateParts = () => {
  const currentDate = moment();

  return {
    year: currentDate.year(),
    month: currentDate.month() + 1,
    day: currentDate.date(),
  };
};

export const getCurrentDate = () => {
  return moment().toDate();
};

export const getCurrentHour = () => {
  return moment().format('HH:mm:ss');
};

export const getCurrentWeekday = () => {
  return moment().isoWeekday();
};

export const isToday = (date: Date): boolean => {
  return moment(date).isSame(moment(), 'day');
};

export const getPreviousMonthAndYear = (
  month: number,
  year: number,
): { previousMonth: number; previousYear: number } => {
  let previousMonth = month - 1;
  let previousYear = year;

  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear--;
  }

  return {
    previousMonth,
    previousYear,
  };
};

export const getTodayString = () => {
  const today = moment().format('YYYY-MM-DD');
  return today;
};

export const getMonthYearLabel = (month: number, year: number) => {
  const monthLabel = new Date(`${year}-${month}-01`).toLocaleDateString(
    'en-US',
    {
      month: 'short',
    },
  );

  return `${monthLabel} ${year}`;
};

export const addOneDay = (endDate: Date) => {
  let date = new Date(endDate);
  date = moment(date).add(1, 'days').toDate();

  return date;
};
