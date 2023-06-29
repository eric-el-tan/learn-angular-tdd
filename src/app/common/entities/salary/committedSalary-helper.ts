import { CommittedSalary, ForecastedSalary } from '../people/staff';
import { DateUtil as d } from 'src/app/common/utils/dateUtil';
import { Period } from '../../utils/periodUtil';

export class CommittedSalaryHelper {

  static getInstance(startDate: string, endDate: string, commitment: number, forecastedSalary: ForecastedSalary,
                     mileStone: string, accPct: number, superannuationPct: number): CommittedSalary {
    let days: number = d.diffDate(d.moment(startDate), d.moment(endDate));
    let daysInYear: number = d.moment(startDate).year() % 4 === 0 && d.moment(endDate).year() % 4 === 0 ?
        366 : 365;
    let salary: number = forecastedSalary.baseSalary * commitment * days / daysInYear;
    let allowance: number = 0.0;
    if (forecastedSalary.allowances) {
      for (let forecastedAllowance of forecastedSalary.allowances) {
        allowance += forecastedAllowance.value;
      }
      allowance = allowance * commitment / daysInYear * days
    }
    let pctAllowance: number = 0.0;
    if (forecastedSalary.pctAllowances) {
      for (let forecastedPctAllowance of forecastedSalary.pctAllowances) {
        pctAllowance += salary * forecastedPctAllowance.pct;
        console.log(`pctAllowance:${pctAllowance} = salary:${forecastedSalary.baseSalary} * commitment:${commitment} / daysInYear:${daysInYear} * days:${days} * pct:${forecastedSalary.pctAllowances.map(e => e.type + ":" + e.pct)} `);
      }
    }
    const acc = (salary + allowance + pctAllowance) * accPct / 100;
    const superannuation = (salary + allowance + pctAllowance) * superannuationPct / 100;
    let committedSalary : CommittedSalary = {
      startDate: startDate,
      endDate: endDate,
      commitment: commitment,
      days: days,
      salary: salary,
      allowance: allowance + pctAllowance,
      acc: acc,
      superannuation: superannuation,
      overhead: 0, // Calculated at a later stage
      mileStone: mileStone,
      forecastedSalary: forecastedSalary,
    };
    return committedSalary;
  }

  static calPeriodSalary(committedSalaries: CommittedSalary[]): number {
    return this.calSalary(committedSalaries)
     + this.calAllowance(committedSalaries)
     + this.calAcc(committedSalaries)
     + this.calSuperannuation(committedSalaries)
     + this.calOverhead(committedSalaries);
  }

  static calFTE(committedSalaries: CommittedSalary[], budgetPeriod: Period): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      let fte = committedSalary.commitment;
      let inDays = d.diffDate(d.moment(committedSalary.endDate), d.moment(committedSalary.startDate));
      let totalDays = d.diffDate(d.getDate(budgetPeriod.endDate), d.getDate(budgetPeriod.startDate));
      fte *= inDays / totalDays;
      result += fte;
    }
    return result;
  }
  
  static calSalary(committedSalaries: CommittedSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.salary;
    }
    return result;
  }
  
  static calAllowance(committedSalaries: CommittedSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.allowance;
    }
    return result;
  }
  
  static calAcc(committedSalaries: CommittedSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.acc;
    }
    return result;
  }
  
  static calSuperannuation(committedSalaries: CommittedSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.superannuation
    }
    return result;
  }
  
  static calOverhead(committedSalaries: CommittedSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.overhead
    }
    return result;
  }
}
