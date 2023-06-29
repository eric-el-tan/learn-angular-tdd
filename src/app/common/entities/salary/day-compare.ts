import { DateUtil as d } from 'src/app/common/utils/dateUtil';

export enum DayCompareType {
  PERIOD_END = "PERIOD_END",
  BUDGET_END = "BUDGET_END",
  BUDGET_START = "BUDGET_START",
}

export class DayCompare {
  private dateStr: string;
  private dateType: string;

	constructor(dateStr: string, dateType: string) {
    if (!dateStr) 
      return;
    if (d.momentToStr(d.moment(dateStr)) !== dateStr) {
      console.error(`invalid date ${dateStr}`);
      throw new Error('invalid date');
    }
    // console.log(`Object.values(DayCompareType)`, Object.values(DayCompareType));
    // if (!Object.values(DayCompareType).includes(dateType)){
    //   console.error(`invalid date ${dateType}`);
    //   throw new Error('invalid date description');
    // }
    this.dateStr = dateStr;
    this.dateType = dateType;
	}

	get type(): string {
		return this.dateType;
	}

	get date(): string {
		return this.dateStr;
	}

	get periodEnd(): string {
    const YEARS: moment.unitOfTime.DurationConstructor = 'year';
    const DAYS: moment.unitOfTime.DurationConstructor = 'days';
    return d.momentToStr(d.moment(this.dateStr).add(1, YEARS).subtract(1, DAYS));
	}
  
  get nextPeriodStart(): string {
    const YEARS: moment.unitOfTime.DurationConstructor = 'year';
    const DAYS: moment.unitOfTime.DurationConstructor = 'days';
    return d.momentToStr(d.moment(this.dateStr).add(1, YEARS));
  }
}
