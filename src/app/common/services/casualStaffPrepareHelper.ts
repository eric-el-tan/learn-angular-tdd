import { cloneDeep } from 'lodash';
import { EditUnnamedStaffComponent } from "src/app/people/edit-unnamed-staff/edit-unnamed-staff.component";
import { FunderRule } from "../entities/funder-rule";
import { Staff, MapOfCommittedSalary, MapOfAmount, CommittedSalary, StaffType } from "../entities/people/staff";
import { BudgetPeriod } from "../entities/peoplePeriod";
import { Budget } from "../entities/project";
import { CommittedSalaryHelper } from "../entities/salary/committedSalary-helper";
import { Inflation, InflationHelper } from "../entities/salary/inflation";
import { Promotion, PromotionHelper } from "../entities/salary/promotion";
import { PromotionForecaster } from "../utils/PromotionForecaster";
import { DateUtil as d, DateUtil } from 'src/app/common/utils/dateUtil';
import { Forecaster } from "../utils/forecaster";
import { PeriodUtil } from "../utils/periodUtil";
import { CasualStaff, CasualCommitment } from '../entities/people/casualStaff';
import { CasualSalaryHelper } from '../entities/salary/casualSalary-helper';

export class CasualStaffPrepareHelper {

  static prepareData(funderRule: FunderRule, casualStaff1: CasualStaff, budget: Budget): CasualStaff {

    let casualStaff2 = cloneDeep(casualStaff1);
    if (!funderRule) {
      return;
    }

    //pre-calculate
    let totalSalaryMap: MapOfAmount[] = [];
    let accMap: MapOfAmount[] = [];
    let holidayPayMap: MapOfAmount[] = [];
    let kiwiSaverMap: MapOfAmount[] = [];
    let casualSalaryMap: MapOfAmount[] = [];
    
    budget.budgetPeriods = PeriodUtil.toPeriods({
      startDate: budget?.budgetStartDate,
      endDate: budget?.budgetEndDate,
    });
    for(let period of budget.budgetPeriods){
      let prefix = casualStaff2.peopleId + '-' + period.startDate;
      let casualCommitment: CasualCommitment = casualStaff2.casualCommitments?.filter((p) => p.startDate === period.startDate).pop();
      if(casualCommitment){
        totalSalaryMap.push({ key: prefix, value: CasualSalaryHelper.calTotalSalary(casualCommitment, funderRule.accPct, 3.0, 8.0) });
        accMap.push({key: prefix, value: CasualSalaryHelper.calAcc(casualCommitment, funderRule.accPct)});
        holidayPayMap.push({key: prefix, value: CasualSalaryHelper.calHoliday(casualCommitment, 8.0)});
        kiwiSaverMap.push({key: prefix, value: CasualSalaryHelper.calKiwiSaver(casualCommitment, 3.0)});
        casualSalaryMap.push({key: prefix, value: CasualSalaryHelper.calCasualSalary(casualCommitment)});   // casualCommitment.foreach( ) i.hour x i.hourlyRate
      }
    }

    // store result of calculate accMap, holiday, kiwisaver, casualSalary
    casualStaff2.totalSalaryMap = totalSalaryMap;
    casualStaff2.accMap = accMap;
    casualStaff2.holidayPayMap = holidayPayMap;
    casualStaff2.kiwiSaverMap = kiwiSaverMap;
    casualStaff2.casualSalaryMap = casualSalaryMap;

    return casualStaff2;
  }
}