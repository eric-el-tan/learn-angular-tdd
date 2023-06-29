import { Injectable } from '@angular/core';
import { AcademicStandardisedRate, ProfessionalStandardisedRate } from '../entities/salary';
import { PeopleSoftService } from '../services/peopleSoft.service';

@Injectable({
  providedIn: 'root',
})
export class SalaryData {
  static professionalStandardisedRates: ProfessionalStandardisedRate[];
  static academicStandardisedRates: AcademicStandardisedRate[];

  static budgetProfessionalStandardisedRates : ProfessionalStandardisedRate[];

  public static setRateCards(_peopleSoftService: PeopleSoftService) {
    _peopleSoftService.academicRateCards$.subscribe((res) => {
      SalaryData.academicStandardisedRates = res;
      // console.log(`Academic subscribe ${JSON.stringify(res)}`);
    });
    _peopleSoftService.professionalRateCards$.subscribe((res) => (SalaryData.professionalStandardisedRates = res));
  }

  public static getProfessionalSalaryArr(year: string, band: string): number[] {
    let profSalary = SalaryData.getProfessionalSalary(band);
    return this.generateSalaryRange(profSalary);
  }

  public static getAcademicSalary(academicRateCard: AcademicStandardisedRate[], grade: string, level: number = -1): number {
    let acadSalary = academicRateCard
      .filter((i) => {
        return i.grade == grade && i.level == level;
      })
      .pop();
    return acadSalary ? acadSalary.scaledSalary : 0;
  }

  public static getProfessionalSalary(band: string): number {
    let profSalary = this.budgetProfessionalStandardisedRates
      .filter((i) => {
        return i.band == band;
      })
      .pop();
    if (profSalary) {
      let midPoint = (profSalary.minimumSalary + profSalary.maximumSalary) / 2;
      let rounded = this.roundToNearest(midPoint);
      return rounded;
    } else return 0;
  }

  public static roundToNearest(amount: number, nearest: number = 1000): number {
    return Math.round(amount / nearest) * nearest;
  }

  private static generateSalaryRange(inSalary: number, interval: number = 5000, count: number = 10): number[] {
    let salaries: number[] = [];
    salaries.push(inSalary);

    let tmpSalary = inSalary - interval;
    for (let countDown = count; countDown > 0 && tmpSalary > 0; countDown--) {
      salaries.push(tmpSalary);
      tmpSalary -= interval;
    }

    let tmpSalary2 = inSalary + interval;
    for (let countUp = count; countUp > 0; countUp--) {
      salaries.push(tmpSalary2);
      tmpSalary2 += interval;
    }

    return salaries.sort((a, b) => a - b); // ascending order
  }
}
