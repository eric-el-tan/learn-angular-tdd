import { Inflation } from './../entities/salary/inflation';
import { cloneDeep } from 'lodash';
import { BudgetPeriod } from '../entities/peoplePeriod';
import {DateUtil, DateUtil as d} from './dateUtil';
import { ForecastedSalary, StaffSalary } from '../entities/people/staff';
import { MileStoneType } from '../entities/salary/milestones';
import { Promotion } from '../entities/salary/promotion';
import { SalaryData } from '../data/salary.data';

const INCREMENT_TYPE_INFLATION = 'inflation';
const INCREMENT_TYPE_PROMOTION = 'promotion';

const DAYS_IN_YEAR = 365;
export class PromotionForecaster {
  // private budgetDates: BudgetDates; //TODO: take inflation date / promotion date out of it
  private inflationDates: Inflation[];
  private promotionDates: Promotion[];
  private period: BudgetPeriod;
  private projectStarted: boolean;
  private salary: StaffSalary;

  constructor(
    inflationDates: Inflation[],
    promotionDates: Promotion[],
    budgetPeriod: BudgetPeriod,
    salary: StaffSalary
  ) {
    this.inflationDates = inflationDates;
    this.promotionDates = promotionDates;
    this.projectStarted = false;
    this.salary = salary;
    this.period = budgetPeriod;
  }

  forecastSalaries(): ForecastedSalary[] {
    // TODO: rename to inflate
    let forecastedSalaries: ForecastedSalary[] = [];
    let forecastedSalaryTemplate: ForecastedSalary = {
      // replace derviedStaff: StaffSalary[]
      baseSalary: 0.0,
      allowances: [],
      pctAllowances: [],
      mileStone: MileStoneType.PERIOD_START,
      numberOfInflation: 0,
      startDate: '',
      endDate: '',
    };

    let salaryEndDate: BudgetPeriod | Inflation | Promotion | null = undefined;
    let inflateIndex: number = 0;
    let promoteIndex: number = 0;
    let tempSalary: number = 0.0;
    while (
      inflateIndex == 0 || // 1st loop
      (!(salaryEndDate instanceof BudgetPeriod) && (inflateIndex < this.inflationDates.length || promoteIndex < this.promotionDates.length)) // other loops
    ) {
      let originSalary: ForecastedSalary = cloneDeep(forecastedSalaryTemplate);
      originSalary.mileStone =
          inflateIndex == 0 && promoteIndex == 0
          ? MileStoneType.PERIOD_START
          : salaryEndDate instanceof Inflation
          ? MileStoneType.INFLATION
          : salaryEndDate instanceof Promotion
          ? MileStoneType.PROMOTION
          : MileStoneType.UNKNOWN;

      originSalary.startDate =
          inflateIndex == 0 && promoteIndex == 0
          ? DateUtil.today()
          : salaryEndDate instanceof Inflation
          ? (salaryEndDate as Inflation).inflationDate
          : salaryEndDate instanceof Promotion
          ? (salaryEndDate as Promotion).promotionDate
          : 'WRONG CASE'; // should not get into this

      originSalary.numberOfInflation = inflateIndex;

      originSalary.baseSalary =
          inflateIndex == 0 && promoteIndex == 0
          ? this.salary.baseSalary
          : salaryEndDate instanceof Inflation
          ? (salaryEndDate as Inflation).inflateSalary(tempSalary)
          : salaryEndDate instanceof Promotion
          ? (salaryEndDate as Promotion).inflateSalary(inflateIndex)
          : -1;

      tempSalary = originSalary.baseSalary;
      originSalary.allowances = cloneDeep(this.salary.allowances);
      originSalary.pctAllowances = cloneDeep(this.salary.pctAllowances);


      salaryEndDate = PromotionForecaster.getMinimumOf(this.period, this.inflationDates[inflateIndex], this.promotionDates[promoteIndex]);
      if (salaryEndDate instanceof BudgetPeriod) {
        originSalary.endDate = (salaryEndDate as BudgetPeriod).endDate;
      } else if (salaryEndDate instanceof Inflation) {
        originSalary.endDate = (salaryEndDate as Inflation).minusOne;
        inflateIndex++;
      } else if (salaryEndDate instanceof Promotion) {
        originSalary.endDate = (salaryEndDate as Promotion).minusOne;
        promoteIndex++;
      }
      forecastedSalaries.push(originSalary);
    }

    // last loop
    let lastSalary: ForecastedSalary = cloneDeep(forecastedSalaryTemplate);
    lastSalary.mileStone = MileStoneType.PERIOD_END;
    lastSalary.startDate =
      salaryEndDate instanceof Inflation
        ? (salaryEndDate as Inflation).inflationDate
        : salaryEndDate instanceof Promotion
        ? (salaryEndDate as Promotion).promotionDate
        : 'WRONG CASE'; // TODO:
    lastSalary.numberOfInflation = inflateIndex;
    lastSalary.baseSalary =
      inflateIndex == 0
        ? this.salary.baseSalary
        : salaryEndDate instanceof Inflation
        ? (salaryEndDate as Inflation).inflateSalary(tempSalary)
        : salaryEndDate instanceof Promotion
        ? (salaryEndDate as Promotion).inflateSalary(inflateIndex)
        : -1;

    lastSalary.allowances = this.salary.allowances;
    lastSalary.pctAllowances = this.salary.pctAllowances;

    lastSalary.endDate = this.period.endDate;
    forecastedSalaries.push(lastSalary);

    forecastedSalaries = forecastedSalaries.filter((a) => d.moment(a.startDate) < d.moment(a.endDate));
    forecastedSalaries.sort((a, b) => d.moment(a.startDate).diff(d.moment(b.startDate)));
    return forecastedSalaries;
  }

  static getMinimumOf(
    period: BudgetPeriod,
    inflationDate: Inflation,
    promotionDate: Promotion
  ): BudgetPeriod | Inflation | Promotion | null {
    if (!period) return null;
    if (!inflationDate && !promotionDate) return period;
    if (!promotionDate) {
      // skip promotion if it's null
      if (d.moment(period.endDate) < d.moment(inflationDate?.minusOne)) {
        return period;
      } else {
        return inflationDate;
      }
    } else if (!inflationDate) {
      // skip inflation if it's null
      if (d.moment(period.endDate) < d.moment(promotionDate?.minusOne)) {
        return period;
      } else if (d.moment(promotionDate?.minusOne) < d.moment(period.endDate)) {
        return promotionDate;
      }
    } else if (inflationDate && promotionDate) {
      if (d.moment(period.endDate) < d.moment(inflationDate?.minusOne) && d.moment(period.endDate) < d.moment(promotionDate?.minusOne)) {
        return period;
      } else if (
        d.moment(inflationDate?.minusOne) < d.moment(period.endDate) &&
        d.moment(inflationDate.minusOne) < d.moment(promotionDate?.minusOne)
      ) {
        return inflationDate;
      } else {
        return promotionDate;
      }
    }
  }
}
