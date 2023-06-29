import { cloneDeep } from 'lodash';
import { ProjectPeriod, SalaryPeriod } from '../entities/peoplePeriod';
import { DateUtil } from 'src/app/common/utils/dateUtil';

export class SalaryUtil {

  static toProjectPeriods(inPeriod: ProjectPeriod, dateFormat: string = 'YYYY-MM-DD'): Array<ProjectPeriod> {
    const clonePeriod = cloneDeep(inPeriod);
    let outPeriods: ProjectPeriod[] = [];

    let index = 0;
    while (true) {
      let startDate1 = '';
      let endDate1 = '';
      // console.log(`clonePeriod:`, clonePeriod);
      startDate1 = clonePeriod.startDate;

      // in1: 2022-01-01 - 2023-12-31, out1:  2022-01-01---2022-12-31, 2023-01-01---2023-12-31
      // in2: 2022-01-01 - 2023-01-01, out2:  2022-01-01---2022-12-31, 2023-01-01---2023-01-01
      // in3: 2022-01-01 - 2022-12-31, out3:  2022-01-01---2022-12-31
      if (DateUtil.getDate(clonePeriod.endDate).isBefore(DateUtil.getDate(DateUtil.nextYear(clonePeriod.startDate, 1)))) {
        endDate1 = clonePeriod.endDate;
        outPeriods.push({ startDate: DateUtil.getDate(startDate1).format(dateFormat), endDate: DateUtil.getDate(endDate1).format(dateFormat) });
        break;
      } else {
        endDate1 = DateUtil.nextYear(clonePeriod.startDate);
        outPeriods.push({ startDate: DateUtil.getDate(startDate1).format(dateFormat), endDate: DateUtil.getDate(endDate1).format(dateFormat) });
        clonePeriod.startDate = DateUtil.nextYearNoSubtract(clonePeriod.startDate, 1); // startDate = Jan1ofNextYear, alter clonePeriod for next loop
      }
      if (DateUtil.getDate(clonePeriod.startDate).isAfter(DateUtil.getDate(clonePeriod.endDate))) {
        break;
      }
      index += 1;
      if (index > 20) {
        console.log('endless loop - to be investigated');
        console.log(`inPeriod: ${JSON.stringify(inPeriod)}`);
        console.log(`clonePeriod: ${JSON.stringify(clonePeriod)}`);
        break;
      }
    }
    return outPeriods;
  }

  static formatProjectPeriods(inPeriods: ProjectPeriod[], dateFormat: string = 'DD/MM/YY'): Array<ProjectPeriod> {
    const clonePeriods = cloneDeep(inPeriods);
    let outPeriods: ProjectPeriod[] = [];
    clonePeriods.forEach((period) => {
      outPeriods.push({ startDate: DateUtil.getDate(period.startDate).format(dateFormat), endDate: DateUtil.getDate(period.endDate).format(dateFormat) });
    });    
    return outPeriods;
  }
}