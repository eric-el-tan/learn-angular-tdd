// import { Staff, StaffType } from 'src/app/common/entities/people/staff';
import { DateUtil as d } from '../../utils/dateUtil';
import { PeopleCost, PeopleType } from '../people/peopleCost';
import { Staff, StaffType } from '../people/staff';

export class Inflation {
  inflationDate: string;
  incrementPercent: number;

  constructor(inflationDate: string, incrementPercent: number) {
    this.inflationDate = inflationDate;
    this.incrementPercent = incrementPercent
    Object.setPrototypeOf(this, Inflation.prototype);
  }

  get minusOne(): string{
    return d.momentToStr(d.subtractDays(d.moment(this.inflationDate), 1));
  }

  inflateSalary(originBaseSalary: number, finalIncrementPercent?: number): number {
    if (finalIncrementPercent < 0) {
      console.error(`Error finalIncrementPercent: ${finalIncrementPercent}`);
      return originBaseSalary;
    }
    if (this.incrementPercent < 0) {
      console.error(`Error this.incrementPercent: ${this.incrementPercent}`);
      return originBaseSalary;
    }

    if (finalIncrementPercent >= 0) {
      if (finalIncrementPercent > 0) {
        return originBaseSalary * (1 + (finalIncrementPercent / 100));
      }
    } else {
      if (this.incrementPercent > 0) {
        return originBaseSalary * (1 + (this.incrementPercent / 100));
      }
    }
    return originBaseSalary;
  }
}

export class InflationHelper {
	day: string;
	month: string;
	incrementPercent: number;
  cutOffDay: string;
  cutOffMonth: string;

	constructor(day: number, month: number, incrementPercent: number, cutOffDay: number, cutOffMonth: number) {
		this.day = day < 10 ? "0" + day : "" + day;
		this.month = month < 10 ? "0" + month : "" + month;
		this.incrementPercent = incrementPercent;
		this.cutOffDay = cutOffDay < 10 ? "0" + cutOffDay : "" + cutOffDay;
		this.cutOffMonth = cutOffMonth < 10 ? "0" + cutOffMonth : "" + cutOffMonth;
	}

  getYearInflationDate(year: number): string {
		return `${year}-${this.month}-${this.day}`;
	}

  generateInflationPeriod(periodStart: string, periodEnd: string, people: PeopleCost): Inflation[] {
    let inflationDates: Inflation[] = [];
    const yearInflationDate = this.getYearInflationDate(d.getYear(periodStart));
    let yearStart = d.moment(periodStart) >= d.moment(yearInflationDate) ? d.getYear(periodStart) + 1 : d.getYear(periodStart);
    let yearEnd = d.getYear(periodEnd);
    let i = 0;
    for (let inflationYear = yearStart; inflationYear <= yearEnd; inflationYear++) {
      let inflationDate: string = `${inflationYear}-${this.month}-${this.day}`;
      i++;
      if (i == 1) {
        let cutOverDate: string = `${inflationYear-1}-${this.cutOffMonth}-${this.cutOffDay}`;
        if (!this.shouldSkipFirstInflation(people, cutOverDate, inflationDate)) {
          inflationDates.push(new Inflation(inflationDate, this.incrementPercent));
        }
      } else {
        inflationDates.push(new Inflation(inflationDate, this.incrementPercent));
      }
    }
    return inflationDates;
  }

  private shouldSkipFirstInflation(people: PeopleCost, cutOffDate: string, inflationDate: string): boolean {
    if (people.peopleType == PeopleType.Unnamed) {
      let staff: Staff = people as Staff;
      if (staff.staffType == StaffType.Professional) {
        let isSkip: boolean = d.moment(staff.salary.lastPromotionDate).isSameOrAfter(d.moment(cutOffDate)) &&
            d.moment(staff.salary.lastPromotionDate).isSameOrBefore(d.moment(inflationDate));
        if (isSkip) {
          console.log(`${staff.peopleType} ${staff.staffType} ${staff.titleDisplay} should skip first inflation as lastPromotionDate: ${staff.salary.lastPromotionDate} isSameOrAfter cutOffDate: ${cutOffDate}`);
        }
        return isSkip;
      }
    }
    return false;
  }
}
