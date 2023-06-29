import { AcademicStandardisedRate } from 'src/app/common/entities/salary';
import { DateUtil as d } from 'src/app/common/utils/dateUtil';
import { GradeBandConfig } from '../../configs/gradeBand-config';
import { SalaryData } from '../../data/salary.data';

export class Promotion {
  promotionDate: string;
  grade: string;
  level: number;
  numberOfInflation: number;
  incrementPercent: number;
  academicRateCard: AcademicStandardisedRate[];

  constructor(promotionDate: string, grade: string, level: number, incrementPercent: number, academicRateCard: AcademicStandardisedRate[]) {
    this.promotionDate = promotionDate;
    this.grade = grade;
    this.level = level;
    this.incrementPercent = incrementPercent;
    this.academicRateCard = academicRateCard;
    Object.setPrototypeOf(this, Promotion.prototype);
  }

  get minusOne(): string {
    return d.momentToStr(d.subtractDays(d.moment(this.promotionDate), 1));
  }

  inflateSalary(numberOfInflation: number, finalIncrementPercent?: number): number {
    this.numberOfInflation = numberOfInflation;
    let baseSalary = SalaryData.getAcademicSalary(this.academicRateCard, GradeBandConfig.toPsGrade(this.grade), this.level);

    for (let i = 0; i < this.numberOfInflation; i++) {
      if (finalIncrementPercent) {
        if (finalIncrementPercent > 0) {
          baseSalary = baseSalary * (1 + (finalIncrementPercent / 100));  
        } 
      } else {
        if (this.incrementPercent > 0) {
          baseSalary = baseSalary * (1 + this.incrementPercent / 100);
        }
      }
    }
    return baseSalary;
  }
}

export class PromotionHelper {
  day: string;
  month: string;
  grade: string;
  level: number;
  incrementPercent: number;
  academicRateCard: AcademicStandardisedRate[];

  constructor(day: number, month: number, grade: string, level: number, incrementPercent: number, academicRateCard: AcademicStandardisedRate[]) {
    this.day = day < 10 ? '0' + day : '' + day;
    this.month = month < 10 ? '0' + month : '' + month;
    this.grade = grade ? grade : 'EMPTY GRADE';
    this.level = level ? level : -1;
    this.incrementPercent = incrementPercent;
    this.academicRateCard = academicRateCard;
  }

  getYearPromotionDate(year: number): string {
    return `${year}-${this.month}-${this.day}`;
  }

  generatePromotionPeriod(periodStart: string, periodEnd: string): Promotion[] {
    let promotionDates: Promotion[] = [];
    let yearStart = d.getYear(periodStart);
    let yearEnd = d.getYear(periodEnd);

    let tmpGrade: string = this.grade;
    let tmpLevel: number = this.level;
    const yearPromotionDate = this.getYearPromotionDate(yearStart);
    let index: number = d.moment(periodStart) >= d.moment(yearPromotionDate) ? -1 : 0;
    for (let promotionYear = yearStart; promotionYear <= yearEnd; promotionYear++) {
      let dateStr: string = `${promotionYear}-${this.month}-${this.day}`;
      let topLevel = GradeBandConfig.getTopLevel(tmpGrade); // SRF, 8, level: 8

      index++;
      if (index > 0) { // skip the first year if promotion date has passed
        tmpLevel++;
        if (tmpLevel > topLevel && tmpGrade == 'PDF') {
          tmpLevel = 1; tmpGrade = 'RF';
        } else if (tmpLevel > topLevel && tmpGrade == 'RF') {
          tmpLevel = 1; tmpGrade = 'SRF';
        } else if (tmpLevel > topLevel && tmpGrade == 'LR') {
          tmpLevel = 1; tmpGrade = 'SL';
        } else if (tmpLevel > topLevel && tmpGrade == 'T') {
          tmpLevel = 1; tmpGrade = 'ST';
        } else if (tmpLevel > topLevel && (tmpGrade == 'SRF' || tmpGrade == 'SL' || tmpGrade == 'ST' || tmpGrade == 'PTF')) {
          tmpLevel = topLevel;
        }

        if (d.moment(dateStr) > d.moment(periodStart) && d.moment(dateStr) < d.moment(periodEnd)) {
          promotionDates.push(new Promotion(dateStr, tmpGrade, tmpLevel, this.incrementPercent, this.academicRateCard));
        }
      }
    }
    return promotionDates;
  }
}