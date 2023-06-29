import { DateUtil as d } from 'src/app/common/utils/dateUtil';
import { Period } from '../../utils/periodUtil';
import { CommittedStudentSalary, ForecastedStudentSalary } from '../people/student';

export class CommittedStudentSalaryHelper {

  static getInstance(startDate: string, endDate: string, commitment: number, forecastedSalary: ForecastedStudentSalary): CommittedStudentSalary {
    let days: number = d.diffDate(d.moment(startDate), d.moment(endDate));
    let daysInYear: number = d.moment(startDate).year() % 4 === 0 && d.moment(endDate).year() % 4 === 0 ?
        366 : 365;
    let stipend = forecastedSalary.stipend * commitment * days / daysInYear;
    let tuition = forecastedSalary.tuition * commitment * days / daysInYear;
    let insurance = forecastedSalary.insurance * commitment * days / daysInYear;
    let studentService = forecastedSalary.studentService * commitment * days / daysInYear;
    let committedSalary : CommittedStudentSalary = {
      startDate: startDate,
      endDate: endDate,
      commitment: commitment,
      stipend: stipend,
      tuition: tuition,
      insurance: insurance,
      studentService: studentService,
      forecastedStudentSalary: forecastedSalary
    };
    return committedSalary;
  }

  static calTotalSalary(committedSalaries: CommittedStudentSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.stipend;
      result += committedSalary.tuition;
      result += committedSalary.insurance;
      result += committedSalary.studentService;
    }
    return result;
  }

  static calPeriodSalary(committedSalaries: CommittedStudentSalary[]): number {
    return this.calTotalSalary(committedSalaries);
  }

  static calFTE(committedSalaries: CommittedStudentSalary[], budgetPeriod: Period): number {
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
  
  static calStipend(committedSalaries: CommittedStudentSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.stipend
    }
    return result;
  }
  
  static calTuition(committedSalaries: CommittedStudentSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.tuition
    }
    return result;
  }
  
  static calInsurance(committedSalaries: CommittedStudentSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.insurance
    }
    return result;
  }
  
  static calStudentService(committedSalaries: CommittedStudentSalary[]): number {
    let result = 0.0;
    for (let committedSalary of committedSalaries) {
      result += committedSalary.studentService
    }
    return result;
  }
  
}