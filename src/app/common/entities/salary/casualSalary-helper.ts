import { Period } from '../../utils/periodUtil';
import { CasualCommitment } from '../people/casualStaff';
import { DateUtil as d } from 'src/app/common/utils/dateUtil';

export class CasualSalaryHelper {

  static calTotalSalary(committedSalaries: CasualCommitment, accPercent: number, kiwiSaverPercent: number, holidayPercent: number): number {
    let salaryOfYear = +committedSalaries.hours * +committedSalaries.hourlyRate;
    let accAmt = (salaryOfYear * (accPercent/100) * 100) / 100;
    let kiwiSaverAmt = (salaryOfYear * (kiwiSaverPercent/100) * 100) / 100;
    let holidayAmt = (salaryOfYear * (holidayPercent/100) * 100) / 100;
    salaryOfYear = (salaryOfYear * 100) / 100;
    return Math.round(salaryOfYear+accAmt+kiwiSaverAmt+holidayAmt);
  }

  static calAcc(committedSalaries: CasualCommitment, accPercent: number): number {
    let salaryOfYear = +committedSalaries.hours * +committedSalaries.hourlyRate;
    let accAmt = (salaryOfYear * (accPercent/100) * 100) / 100;
    return Math.round(accAmt);
  }

  static calHoliday(committedSalaries: CasualCommitment, holidayPercent: number): number {
    let salaryOfYear = +committedSalaries.hours * +committedSalaries.hourlyRate;
    let holidayAmt = (salaryOfYear * (holidayPercent/100) * 100) / 100;
    return Math.round(holidayAmt);
  }

  static calKiwiSaver(committedSalaries: CasualCommitment, kiwiSaverPercent: number): number {
    let salaryOfYear = +committedSalaries.hours * +committedSalaries.hourlyRate;
    let kiwiSaverAmt = (salaryOfYear * (kiwiSaverPercent/100) * 100) / 100;
    return Math.round(kiwiSaverAmt);
  }

  static calCasualSalary(committedSalaries: CasualCommitment): number {
    let salaryOfYear = ((+committedSalaries.hours * +committedSalaries.hourlyRate) * 100) / 100;
    return Math.round(salaryOfYear);
  }
}