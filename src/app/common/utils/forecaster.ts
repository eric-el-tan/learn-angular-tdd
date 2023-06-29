import { Inflation } from './../entities/salary/inflation';
import { cloneDeep } from 'lodash';
import { BudgetPeriod } from '../entities/peoplePeriod';
import {DateUtil, DateUtil as d} from './dateUtil';
import { ForecastedSalary, StaffSalary } from '../entities/people/staff';
import { MileStoneType } from '../entities/salary/milestones';
import { SalaryData } from '../data/salary.data';

const INCREMENT_TYPE_INFLATION = 'inflation';
const INCREMENT_TYPE_PROMOTION = 'promotion';

const DAYS_IN_YEAR = 365;
export class Forecaster {
  // private budgetDates: BudgetDates; //TODO: take inflation date / promotion date out of it
  private inflationDates: Inflation[];
  private period: BudgetPeriod;
  private projectStarted: boolean;
  private salary: StaffSalary;

  constructor(peopleType: string, inflationDates: Inflation[], budgetPeriod: BudgetPeriod, salary: StaffSalary) {
    this.inflationDates = inflationDates;
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

    let salaryEndDate: BudgetPeriod | Inflation | null = undefined;
    let inflateIndex: number = 0;
    let tempSalary: number = 0.0;
    while (
      inflateIndex == 0 || // 1st loop
      (!(salaryEndDate instanceof BudgetPeriod) && this.inflationDates[inflateIndex] !== undefined) // other loops
    ) {
      let originSalary: ForecastedSalary = cloneDeep(forecastedSalaryTemplate);

      originSalary.mileStone = inflateIndex == 0 ? MileStoneType.PERIOD_START : MileStoneType.INFLATION;

      originSalary.startDate =
        inflateIndex == 0
          ? DateUtil.today()
          : salaryEndDate instanceof Inflation
          ? (salaryEndDate as Inflation).inflationDate
          : 'WRONG CASE'; // should not get into this

      originSalary.numberOfInflation = inflateIndex;

      originSalary.baseSalary = inflateIndex == 0 ? this.salary.baseSalary : (salaryEndDate as Inflation).inflateSalary(tempSalary);
      originSalary.allowances = cloneDeep(this.salary.allowances);
      originSalary.pctAllowances = cloneDeep(this.salary.pctAllowances);

      tempSalary = originSalary.baseSalary;

      salaryEndDate = Forecaster.getMinimumOf(this.period, this.inflationDates[inflateIndex]);
      if (salaryEndDate instanceof BudgetPeriod) {
        originSalary.endDate = (salaryEndDate as BudgetPeriod).endDate;
      } else if (salaryEndDate instanceof Inflation) {
        originSalary.endDate = (salaryEndDate as Inflation).minusOne;
      }
      forecastedSalaries.push(originSalary);
      inflateIndex++;
    }

    // last loop
    let lastSalary: ForecastedSalary = cloneDeep(forecastedSalaryTemplate);
    lastSalary.mileStone = MileStoneType.PERIOD_END;
    lastSalary.startDate = salaryEndDate instanceof Inflation ? (salaryEndDate as Inflation).inflationDate : 'WRONG CASE';
    lastSalary.numberOfInflation = inflateIndex;

    lastSalary.baseSalary = inflateIndex == 0 ? this.salary.baseSalary : (salaryEndDate as Inflation).inflateSalary(tempSalary);

    lastSalary.baseSalary = SalaryData.roundToNearest(lastSalary.baseSalary, 0.01);
    lastSalary.allowances = cloneDeep(this.salary.allowances);
    lastSalary.pctAllowances = cloneDeep(this.salary.pctAllowances);

    lastSalary.endDate = this.period.endDate;
    forecastedSalaries.push(lastSalary);

    forecastedSalaries.sort((a, b) => d.moment(a.startDate).diff(d.moment(b.startDate)));
    return forecastedSalaries;
  }

  static getMinimumOf(period: BudgetPeriod, inflationDate: Inflation): BudgetPeriod | Inflation | null {
    if (!period || !inflationDate) return null;
    if (!inflationDate) return period;
    if (d.moment(period.endDate) < d.moment(inflationDate.minusOne)) {
      return period;
    } else {
      return inflationDate;
    }
  }
}
