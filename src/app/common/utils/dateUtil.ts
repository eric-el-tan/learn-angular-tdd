import moment from "moment";

export class DateUtil {
  public static DAY: moment.unitOfTime.DurationConstructor = 'days';
  public static MONTH: moment.unitOfTime.DurationConstructor = 'month';
  public static YEAR: moment.unitOfTime.DurationConstructor = 'year';

  static today(): string {
    let date = moment();
    return DateUtil.momentToStr(date);
  }

  static todayDateTime(): string {
    let date = moment();
    return DateUtil.momentDateTimeToStr(date);
  }

  static tomorrow(): string {
    let date = moment();
    let units: moment.unitOfTime.DurationConstructor = 'days';
    return DateUtil.momentToStr(date.add(1, units));
  }

  static subtractYears(dateStart: string, dateEnd: string) {
    let start = this.moment(dateStart);
    let end = this.moment(dateEnd);
    return +end.diff(start, 'years', true).toPrecision(1);
  }

  static momentDateTimeToStr(date: moment.Moment): string {
    return date.format('YYYY-MM-DD hh:mm:ss');
  }

  static momentToStr(date: moment.Moment): string {
    return date.format('YYYY-MM-DD');
  }

  static moment(dateStr: string): moment.Moment {
    return this.toMoment(dateStr);
  }

  static toMoment(dateStr: string): moment.Moment {
    return moment(dateStr, 'YYYY-MM-DD');
  }

  static getDate(date: string): moment.Moment {
    return moment(date, 'YYYY-MM-DD').startOf('day').utc(true);
  }

  static addDay(date: moment.Moment, days: number): moment.Moment {
    let units: moment.unitOfTime.DurationConstructor = 'days';
    return date.add(days, units);
  }

  static addMonth(date: moment.Moment, months: number): moment.Moment {
    let units: moment.unitOfTime.DurationConstructor = 'month';
    return date.add(months, units);
  }

  static addYears(date: moment.Moment, years: number): moment.Moment {
    let units: moment.unitOfTime.DurationConstructor = 'year';
    return date.add(years, units);
  }

  static subtractDays(date: moment.Moment, days: number): moment.Moment {
    let units: moment.unitOfTime.DurationConstructor = 'days';
    return date.subtract(days, units);
  }

  static nextYear(dateStr: string, years: number = 1): string {
    let date = DateUtil.subtractDays(DateUtil.addYears(DateUtil.toMoment(dateStr), years), 1);
    return DateUtil.momentToStr(date);
  }

  static nextYearNoSubtract(dateStr: string, years: number = 1): string {
    let date = DateUtil.addYears(DateUtil.toMoment(dateStr), years);
    return DateUtil.momentToStr(date);
  }

  static nextMonth(dateStr: string, months: number = 1): string {
    let date = DateUtil.subtractDays(DateUtil.addMonth(DateUtil.toMoment(dateStr), months), 1);
    return DateUtil.momentToStr(date);
  }

  static onOrAfter(date1: moment.Moment, date2: moment.Moment): boolean {
    return date1.isSameOrAfter(date2);
  }

  static onOrBefore(date1: moment.Moment, date2: moment.Moment): boolean {
    return date1.isSameOrBefore(date2);
  }

  static diffDate(start: moment.Moment, end: moment.Moment): number {
    return Math.round(Math.abs(moment.duration(start.diff(end)).asDays()) + 1); // + 1 to include end date
  }

  static diffDate2(start: moment.Moment, end: moment.Moment): number {
    return Math.round(moment.duration(start.diff(end)).asDays() + 1); // + 1 to include end date
  }

  static nextInflationDate(lastPromotionDate: moment.Moment, inflationMonthDay: moment.Moment): moment.Moment {
    let nextYear = lastPromotionDate.year() + 1;
    let thisYear = lastPromotionDate.year();
    let month = inflationMonthDay.month() + 1;
    let day = inflationMonthDay.day();

    // a- lpd: 2021-01-15, ifd: 2021-02-01
    // b- lpd: 2021-02-01, ifd: 2021-02-01
    // c- lpd: 2021-03-01, ifd: 2021-02-01
    if (lastPromotionDate < DateUtil.toMoment(thisYear + '-' + month + '-' + day)) {
      // same year
      // a- lpd: 2021-01-15, ifd: 2021-02-01
      return DateUtil.toMoment(thisYear + '-' + month + '-' + day);
    } else {
      // next year
      // b- lpd: 2021-02-01, ifd: 2021-02-01
      // c- lpd: 2021-03-01, ifd: 2021-02-01
      return DateUtil.toMoment(nextYear + '-' + month + '-' + day);
    }
  }

  static nextPromotionDate(inflationDate: moment.Moment, promotionMonthDay: moment.Moment): moment.Moment {
    let nextYear = inflationDate.year() + 1;
    let thisYear = inflationDate.year() + 1;
    let month = promotionMonthDay.month() + 1;
    let day = promotionMonthDay.day();

    // a- lpd: 2021-02-01, pd: 2021-01-15
    // b- lpd: 2021-02-01, pd: 2021-02-01
    // c- lpd: 2021-02-01, pd: 2021-07-01
    if (inflationDate < DateUtil.toMoment(thisYear + '-' + month + '-' + day)) {
      // same year
      return DateUtil.toMoment(thisYear + '-' + month + '-' + day);
    } else {
      // next year
      // a- lpd: 2021-02-01, pd: 2021-01-15
      // b- lpd: 2021-02-01, pd: 2021-02-01
      return DateUtil.toMoment(nextYear + '-' + month + '-' + day);
    }
  }

  static getYear(date: string): number {
    return Number.parseInt(moment(date, 'YYYY-MM-DD').format('YYYY'));
  }
  static getMonth(date: string): number {
    return Number.parseInt(moment(date, 'YYYY-MM-DD').format('M'));
  }
  static getDay(date: string): number {
    return Number.parseInt(moment(date, 'YYYY-MM-DD').format('D'));
  }
  static convertTimeStampToDateTimeString(timestamp: number) {
    let date = moment(new Date(timestamp));
    return date.format('DD-MM-YYYY hh:mm:ss a');
  }
}
