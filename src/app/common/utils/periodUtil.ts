import { Commitment } from './../entities/people/commitment';
import {CommittedSalary, ForecastedSalary, MapOfCommittedSalary} from './../entities/people/staff';
import { DayCompare, DayCompareType } from './../entities/salary/day-compare';
import { cloneDeep } from 'lodash';
import { DateUtil as d } from './dateUtil';
import { CommittedSalaryHelper } from '../entities/salary/committedSalary-helper';
import {CommittedStudentSalary, ForecastedStudentSalary, MapOfCommittedStudentSalary} from '../entities/people/student';
import { CommittedStudentSalaryHelper } from '../entities/salary/committedStudentSalary-helper';

export class Period {
  startDate: string;
  endDate: string;
}

export class PeriodUtil {
  static periodTemplate: Period = {
    startDate: '',
    endDate: ''
  }

  // replace SalaryUtil.toProjectPeriods()
  static toPeriods(inPeriod: Period, dateFormat: string = 'YYYY-MM-DD'): Array<Period> {
    
    let periods: Period[] = [];
    let budgetStart: DayCompare = new DayCompare(inPeriod.startDate, DayCompareType.BUDGET_START);
    let budgetEnd: DayCompare = new DayCompare(inPeriod.endDate, DayCompareType.BUDGET_END);
    let periodEnd: DayCompare = undefined;
    
    let index: number = 0;
    let correctPeriodEnd: DayCompare = undefined;
    while (
      index === 0 || 
      correctPeriodEnd.type === DayCompareType.PERIOD_END
      )
      {
      let period: Period = cloneDeep(PeriodUtil.periodTemplate);
      period.startDate = (index === 0) ? 
        budgetStart.date : 
        correctPeriodEnd.nextPeriodStart;
      
      periodEnd = (index === 0) ? 
        new DayCompare(inPeriod.startDate, DayCompareType.PERIOD_END) : 
        new DayCompare(period.startDate, DayCompareType.PERIOD_END);

      correctPeriodEnd = PeriodUtil.getMinimumOf(budgetEnd, periodEnd);

      switch (correctPeriodEnd.type) {
        case DayCompareType.PERIOD_END:
          period.endDate = periodEnd.periodEnd; break;
        case DayCompareType.BUDGET_END:
          period.endDate = budgetEnd.date; break;
        default: 
          console.error('WRONG algorithm: Incorrect DayCompareType', correctPeriodEnd.type);
          throw new Error ('WRONG algorithm: Incorrect DayCompareType');
      }
      periods.push(period);
      index++;
    }
    return periods;
  }
  
  static getMinimumOf(budgetEnd: DayCompare, periodEnd: DayCompare): DayCompare{
    if (!budgetEnd || !periodEnd)
      return null;
    if ( d.moment(budgetEnd.date) < d.moment(periodEnd.nextPeriodStart)) {
      return budgetEnd;
    } else {
      return periodEnd;
    }
  }

  static toCommittedSalaries(
      peopleId: string,
      forecastedSalaries: ForecastedSalary[],
      commitments: Commitment[],
      periods: Period[],
      maxSalary: number,
      maxOverhead: number,
      accPct: number,
      superannuationPct: number,
      overheadPct: number
  ) {
    const budgetPeriodSalaryMap: MapOfCommittedSalary[] = [];
    for (const period of periods) {
      budgetPeriodSalaryMap.push({
        key: peopleId + '-' + period.startDate,
        value: PeriodUtil.toCommittedSalary(forecastedSalaries, commitments, period, maxSalary, maxOverhead, accPct, superannuationPct, overheadPct),
      });
    }

    return budgetPeriodSalaryMap
  }

  static toCommittedSalary(
    forecastedSalaries: ForecastedSalary[],
    commitments: Commitment[],
    period: Period,
    maxSalary: number,
    maxOverhead: number,
    accPct: number,
    superannuationPct: number,
    overheadPct: number
  ): CommittedSalary[] {
    // console.log(`projectPeriod: ${JSON.stringify(project)}`);
    // console.log(`peoplePeriods: ${JSON.stringify(peoplePeriods)}`);  
    let clonedCommitments = cloneDeep(commitments);
    let outPeriods: any[] = [];
    for (let commitment of clonedCommitments) {
      let startDate1 = '';
      let endDate1 = '';

      // a1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2021-12-31
      // a2- project.sd: 2021-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
      // b1- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2022-12-31
      // b2- project.sd: 2022-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
      // c1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
      // c2- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
      if (
        (d.moment(commitment.startDate) >= d.moment(period.startDate) && d.moment(commitment.startDate) <= d.moment(period.endDate)) ||
        (d.moment(commitment.endDate) >= d.moment(period.startDate) && d.moment(commitment.endDate) <= d.moment(period.endDate))
      ) {
        // in-scope
        if (d.moment(commitment.startDate) >= d.moment(period.startDate)) {
          // use person.sd
          startDate1 = commitment.startDate;
          if (d.moment(commitment.endDate) <= d.moment(period.endDate)) {
            // use person.ed
            //  a1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2021-12-31
            endDate1 = commitment.endDate;
            outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment, mileStone: 'USER_ENTRY' });
          } else {
            // use project.ed
            // b2- project.sd: 2022-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
            // c1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
            endDate1 = period.endDate;
            outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment, mileStone: 'USER_ENTRY' });
          }
        } else if (d.moment(commitment.endDate) <= d.moment(period.endDate)) {
          // use person.ed
          // b1- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2022-12-31
          startDate1 = period.startDate;
          endDate1 = commitment.endDate;
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment, mileStone: 'USER_ENTRY' });
        } else {
          // really will happen?
          startDate1 = period.startDate;
          endDate1 = period.endDate;
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment, mileStone: 'USER_ENTRY' });
        }
      }
      if (d.moment(commitment.startDate) < d.moment(period.startDate) && d.moment(commitment.endDate) > d.moment(period.endDate)) {
        // non-overlap, in-scope
        // c2- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
        startDate1 = period.startDate;
        endDate1 = period.endDate;
        outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment, mileStone: 'USER_ENTRY' });
      }
    }
    // ignore, out-scope
    // a2- project.sd: 2021-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
  
    // console.log(`outPeriods: ${JSON.stringify(outPeriods)}`);
    // console.log(`staffSalaries: ${JSON.stringify(staffSalaries)}`);
  
    // a- outPeriods: [{ startDate: '2021-01-01', endDate: '2021-12-31', commitment: 1 }];
    // b- outPeriods: [
    //   { startDate: '2022-01-01', endDate: '2022-08-31', commitment: 1 },
    //   { startDate: '2022-09-01', endDate: '2022-12-31', commitment: 1 },
    // ];
    // c- outPeriods: [{ startDate: '2023-01-01', endDate: '2023-12-31', commitment: 1 }];
  
    // staffSalaries: [{"startDate":"2021-01-01", expireDate:"2022-06-30"},{"startDate":"2022-07-01", expireDate:"2099-12-31"}]


    // Split periods by Calendar year

    clonedCommitments = cloneDeep(outPeriods);
    outPeriods = [];
    let end: boolean;

    for (const commitment of clonedCommitments) {
      let startDate1 = commitment.startDate;
      const endDate1 = commitment.endDate;
      end = false;
      while (!end) {
        if (d.moment(startDate1).year() !== d.moment(endDate1).year()) {
          outPeriods.push({ startDate: startDate1,
            endDate: d.momentToStr(d.moment(startDate1).month(11).date(31)),
            commitment: commitment.commitment,
            mileStone: startDate1 === commitment.startDate ? 'USER_ENTRY' : 'NEW_YEAR'});
          startDate1 = d.momentToStr(d.moment(startDate1).year(d.moment(startDate1).year() + 1).month(0).date(1))
        } else {
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment,
            mileStone: startDate1 === commitment.startDate ? 'USER_ENTRY' : 'NEW_YEAR'});
          end = true
        }
      }
    }


    let committedSalaries: CommittedSalary[] = [];
    
    let clonedForecastedSalaries: ForecastedSalary[] = cloneDeep(forecastedSalaries);
    clonedForecastedSalaries.forEach((forecastedSalary, salaryIndex) => {
      for (let person of outPeriods) {
        let startDate1 = '';
        let endDate1 = '';
        // a1- person.sd: 2021-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2021-12-31
        // a2- person.sd: 2021-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2021-12-31
        // b1- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-08-31
        // b2- person.sd: 2022-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-08-31
        // b3- person.sd: 2022-09-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-12-31
        // b4- person.sd: 2022-09-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-12-31
        // c1- person.sd: 2023-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2023-12-31
        // c2- person.sd: 2023-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2023-12-31
        if (
          (d.moment(forecastedSalary.startDate) >= d.moment(person.startDate) && d.moment(forecastedSalary.startDate) <= d.moment(person.endDate)) ||
          (d.moment(forecastedSalary.endDate) >= d.moment(person.startDate) && d.moment(forecastedSalary.endDate) <= d.moment(person.endDate))
        ) {
          // in scope
          if (d.moment(forecastedSalary.startDate) >= d.moment(person.startDate)) {
            if (d.moment(forecastedSalary.startDate) > d.moment(person.startDate)) {
              // split period by startDate
              // b2- person.sd: 2022-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-08-31
              // if (salaryIndex > 0) {
              startDate1 = forecastedSalary.startDate;
  
              if (d.moment(forecastedSalary.endDate) > d.moment(person.endDate)){
                endDate1 = person.endDate;
              } else {
                endDate1 = forecastedSalary.endDate;
              }
              committedSalaries.push(CommittedSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary), forecastedSalary.mileStone, accPct, superannuationPct));
            } else {
              // a1- person.sd: 2021-01-01 <= staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2021-12-31
              startDate1 = person.startDate;
  
              if (d.moment(forecastedSalary.endDate) > d.moment(person.endDate)){
                endDate1 = person.endDate;
              } else {
                endDate1 = forecastedSalary.endDate;
              }
              committedSalaries.push(CommittedSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary), person.mileStone, accPct, superannuationPct));
            }
          } else if (d.moment(forecastedSalary.endDate) <= d.moment(person.endDate)) {
            // split period by expireDate
            if (d.moment(forecastedSalary.endDate) < d.moment(person.endDate)) {
              // b1- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-08-31
              startDate1 = person.startDate;
              endDate1 = forecastedSalary.endDate;
              committedSalaries.push(CommittedSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary), person.mileStone, accPct, superannuationPct));
            } else {
              // if b11- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-08-31 == person.ed: 2022-08-31
              startDate1 = person.startDate;
              endDate1 = person.endDate;
              committedSalaries.push(CommittedSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary), person.mileStone, accPct, superannuationPct));
            }
          }
        }
        if (d.moment(forecastedSalary.startDate) < d.moment(person.startDate) && d.moment(forecastedSalary.endDate) > d.moment(person.endDate)) {
          // non-overlap, in-scope
          // b4- person.sd: 2022-09-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-12-31
          // c2- person.sd: 2023-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2023-12-31
          startDate1 = person.startDate;
          endDate1 = person.endDate;
          committedSalaries.push(CommittedSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary), person.mileStone, accPct, superannuationPct));
        }
        // ignore, not within person period
        // a2- person.sd: 2021-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2021-12-31
        // b3- person.sd: 2022-09-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-12-31
        // c1- person.sd: 2023-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2023-12-31
      }
    });
    // console.log(`salaryPeriods: ${JSON.stringify(salaryPeriods)}`);

    // Cap salary change percent

    // Cap salary, allowance, acc, superannuation
    let totalSalary = 0.0;
    for (const committedSalary of committedSalaries) {
      totalSalary += committedSalary.salary +
          committedSalary.allowance +
          committedSalary.acc +
          committedSalary.superannuation;
    }
    if (totalSalary > maxSalary) {
      const multiplier = maxSalary / totalSalary;
      for (let i = 0; i < committedSalaries.length; i++) {
        committedSalaries[i].salary *= multiplier;
        committedSalaries[i].allowance *= multiplier;
        committedSalaries[i].acc *= multiplier;
        committedSalaries[i].superannuation *= multiplier;
      }
    }

    // Calculate overhead from adjusted salary
    for (let i = 0; i < committedSalaries.length; i++) {
      committedSalaries[i].overhead = (committedSalaries[i].salary +
          committedSalaries[i].allowance) * overheadPct / 100;
    }

    // Cap overheads
    let totalOverhead = 0.0;
    for (const committedSalary of committedSalaries) {
      totalOverhead += committedSalary.overhead;
    }
    if (totalOverhead > maxOverhead) {
      const multiplier = maxOverhead / totalOverhead;
      for (let i = 0; i < committedSalaries.length; i++) {
        committedSalaries[i].overhead *= multiplier;
      }
    }

    // Round all values to 2dp
    for (let i = 0; i < committedSalaries.length; i++) {
      committedSalaries[i].salary = Math.round(committedSalaries[i].salary * 100) / 100;
      committedSalaries[i].allowance = Math.round(committedSalaries[i].allowance * 100) / 100;
      committedSalaries[i].acc = Math.round(committedSalaries[i].acc * 100) / 100;
      committedSalaries[i].superannuation = Math.round(committedSalaries[i].superannuation * 100) / 100;
      committedSalaries[i].overhead = Math.round(committedSalaries[i].overhead * 100) / 100
    }

    return committedSalaries;
  }

  static toCommittedStudentSalaries(
      peopleId: string,
      forecastedSalaries: ForecastedStudentSalary[],
      commitments: Commitment[],
      periods: Period[],
      maxTuition: number,
      tuitionAnnualIncreasePct: number,
      funderEffectiveStartDate: string,
  ) {
    const budgetPeriodSalaryMap: MapOfCommittedStudentSalary[] = [];
    let numOfYear = d.getYear(periods[0].startDate) - d.getYear(funderEffectiveStartDate)+1;
    for (const period of periods) {
      budgetPeriodSalaryMap.push({
        key: peopleId + '-' + period.startDate,
        value: PeriodUtil.toCommittedStudentSalary(forecastedSalaries, commitments, period, inflateTuitionLimit(maxTuition, tuitionAnnualIncreasePct, numOfYear)),
      });
      numOfYear++;
    }

    function inflateTuitionLimit(limit: number, pct: number, numOfYear: number): number {
      let inflatedLimit = limit;
      for (let i=0; i < numOfYear; i++) {
        inflatedLimit = inflatedLimit * (1 + pct/100);
      }
      return inflatedLimit;
    }

    return budgetPeriodSalaryMap
  }

  static toCommittedStudentSalary(
    forecastedSalaries: ForecastedStudentSalary[],
    commitments: Commitment[],
    period: Period,
    maxTuition: number
  ): CommittedStudentSalary[] {
    // console.log(`projectPeriod: ${JSON.stringify(project)}`);
    // console.log(`peoplePeriods: ${JSON.stringify(peoplePeriods)}`);  
    let clonedCommitments = cloneDeep(commitments);
    let outPeriods: Commitment[] = [];
    for (let commitment of clonedCommitments) {
      let startDate1 = '';
      let endDate1 = '';
  
      // a1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2021-12-31
      // a2- project.sd: 2021-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
      // b1- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2022-12-31
      // b2- project.sd: 2022-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
      // c1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
      // c2- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
      if (
        (d.moment(commitment.startDate) >= d.moment(period.startDate) && d.moment(commitment.startDate) <= d.moment(period.endDate)) ||
        (d.moment(commitment.endDate) >= d.moment(period.startDate) && d.moment(commitment.endDate) <= d.moment(period.endDate))
      ) {
        // in-scope
        if (d.moment(commitment.startDate) >= d.moment(period.startDate)) {
          // use person.sd
          startDate1 = commitment.startDate;
          if (d.moment(commitment.endDate) <= d.moment(period.endDate)) {
            // use person.ed
            //  a1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2021-12-31
            endDate1 = commitment.endDate;
            outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
          } else {
            // use project.ed
            // b2- project.sd: 2022-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
            // c1- project.sd: 2021-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
            endDate1 = period.endDate;
            outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
          }
        } else if (d.moment(commitment.endDate) <= d.moment(period.endDate)) {
          // use person.ed
          // b1- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2022-08-31 < project.ed: 2022-12-31
          startDate1 = period.startDate;
          endDate1 = commitment.endDate;
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
        } else {
          // really will happen?
          startDate1 = period.startDate;
          endDate1 = period.endDate;
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
        }
      }
      if (d.moment(commitment.startDate) < d.moment(period.startDate) && d.moment(commitment.endDate) > d.moment(period.endDate)) {
        // non-overlap, in-scope
        // c2- project.sd: 2022-01-01 < person.sd: 2021-01-01 < person.ed: 2023-12-31 < project.ed: 2022-12-31
        startDate1 = period.startDate;
        endDate1 = period.endDate;
        outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
      }
    }
    // ignore, out-scope
    // a2- project.sd: 2021-01-01 < person.sd: 2022-09-01 < person.ed: 2023-12-31 < project.ed: 2021-12-31
  
    // console.log(`outPeriods: ${JSON.stringify(outPeriods)}`);
    // console.log(`staffSalaries: ${JSON.stringify(staffSalaries)}`);
  
    // a- outPeriods: [{ startDate: '2021-01-01', endDate: '2021-12-31', commitment: 1 }];
    // b- outPeriods: [
    //   { startDate: '2022-01-01', endDate: '2022-08-31', commitment: 1 },
    //   { startDate: '2022-09-01', endDate: '2022-12-31', commitment: 1 },
    // ];
    // c- outPeriods: [{ startDate: '2023-01-01', endDate: '2023-12-31', commitment: 1 }];
  
    // staffSalaries: [{"startDate":"2021-01-01", expireDate:"2022-06-30"},{"startDate":"2022-07-01", expireDate:"2099-12-31"}]


    // Split periods by Calendar year

    clonedCommitments = cloneDeep(outPeriods);
    outPeriods = [];
    let end: boolean;

    for (const commitment of clonedCommitments) {
      let startDate1 = commitment.startDate;
      const endDate1 = commitment.endDate;
      end = false;
      while (!end) {
        if (d.moment(startDate1).year() !== d.moment(endDate1).year()) {
          outPeriods.push({ startDate: startDate1,
            endDate: d.momentToStr(d.moment(startDate1).month(11).date(31)),
            commitment: commitment.commitment });
          startDate1 = d.momentToStr(d.moment(startDate1).year(d.moment(startDate1).year() + 1).month(0).date(1))
        } else {
          outPeriods.push({ startDate: startDate1, endDate: endDate1, commitment: commitment.commitment });
          end = true
        }
      }
    }


    let committedSalaries: CommittedStudentSalary[] = [];
    
    let clonedForecastedSalaries: ForecastedStudentSalary[] = cloneDeep(forecastedSalaries);
    clonedForecastedSalaries.forEach((forecastedSalary, salaryIndex) => {
      for (let person of outPeriods) {
        let startDate1 = '';
        let endDate1 = '';
        // a1- person.sd: 2021-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2021-12-31
        // a2- person.sd: 2021-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2021-12-31
        // b1- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-08-31
        // b2- person.sd: 2022-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-08-31
        // b3- person.sd: 2022-09-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-12-31
        // b4- person.sd: 2022-09-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-12-31
        // c1- person.sd: 2023-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2023-12-31
        // c2- person.sd: 2023-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2023-12-31
        if (
          (d.moment(forecastedSalary.startDate) >= d.moment(person.startDate) && d.moment(forecastedSalary.startDate) <= d.moment(person.endDate)) ||
          (d.moment(forecastedSalary.endDate) >= d.moment(person.startDate) && d.moment(forecastedSalary.endDate) <= d.moment(person.endDate))
        ) {
          // in scope
          if (d.moment(forecastedSalary.startDate) >= d.moment(person.startDate)) {
            if (d.moment(forecastedSalary.startDate) > d.moment(person.startDate)) {
              // split period by startDate
              // b2- person.sd: 2022-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-08-31
              // if (salaryIndex > 0) {
              startDate1 = forecastedSalary.startDate;
  
              if (d.moment(forecastedSalary.endDate) > d.moment(person.endDate)){
                endDate1 = person.endDate;
              } else {
                endDate1 = forecastedSalary.endDate;
              }
              committedSalaries.push(CommittedStudentSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary)));
            } else {
              // a1- person.sd: 2021-01-01 <= staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2021-12-31
              startDate1 = person.startDate;
  
              if (d.moment(forecastedSalary.endDate) > d.moment(person.endDate)){
                endDate1 = person.endDate;
              } else {
                endDate1 = forecastedSalary.endDate;
              }
              committedSalaries.push(CommittedStudentSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary)));
            }
          } else if (d.moment(forecastedSalary.endDate) <= d.moment(person.endDate)) {
            // split period by expireDate
            if (d.moment(forecastedSalary.endDate) < d.moment(person.endDate)) {
              // b1- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-08-31
              startDate1 = person.startDate;
              endDate1 = forecastedSalary.endDate;
              committedSalaries.push(CommittedStudentSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary)));
            } else {
              // if b11- person.sd: 2022-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-08-31 == person.ed: 2022-08-31
              startDate1 = person.startDate;
              endDate1 = person.endDate;
              committedSalaries.push(CommittedStudentSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary)));
            }
          }
        }
        if (d.moment(forecastedSalary.startDate) < d.moment(person.startDate) && d.moment(forecastedSalary.endDate) > d.moment(person.endDate)) {
          // non-overlap, in-scope
          // b4- person.sd: 2022-09-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2022-12-31
          // c2- person.sd: 2023-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2023-12-31
          startDate1 = person.startDate;
          endDate1 = person.endDate;
          committedSalaries.push(CommittedStudentSalaryHelper.getInstance(startDate1, endDate1, person.commitment, cloneDeep(forecastedSalary)));
        }
        // ignore, not within person period
        // a2- person.sd: 2021-01-01 < staff.pd: 2022-07-01 < staff.ed: 2099-12-31 < person.ed: 2021-12-31
        // b3- person.sd: 2022-09-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2022-12-31
        // c1- person.sd: 2023-01-01 < staff.pd: 2021-01-01 < staff.ed: 2022-06-30 < person.ed: 2023-12-31
      }
    });
    // console.log(`salaryPeriods: ${JSON.stringify(salaryPeriods)}`);

    // Cap tuition
    let totalTuition = 0.0;
    for (const committedSalary of committedSalaries) {
      totalTuition += committedSalary.tuition;
    }
    if (totalTuition > maxTuition) {
      const multiplier = maxTuition / totalTuition;
      console.log(`hit maxTuition? totalTuition: ${totalTuition} > maxTuition: ${maxTuition} ? ${totalTuition > maxTuition}`, `-> discount tuition by ${multiplier}`);
      for (let i = 0; i < committedSalaries.length; i++) {
        committedSalaries[i].tuition *= multiplier;
      }
    }

    // Round all values to 2dp
    for (let i = 0; i < committedSalaries.length; i++) {
      committedSalaries[i].stipend = Math.round(committedSalaries[i].stipend * 100) / 100;
      committedSalaries[i].tuition = Math.round(committedSalaries[i].tuition * 100) / 100;
      committedSalaries[i].insurance = Math.round(committedSalaries[i].insurance * 100) / 100;
      committedSalaries[i].studentService = Math.round(committedSalaries[i].studentService * 100) / 100;
    }

    return committedSalaries;
  }
}
