import { cloneDeep } from 'lodash';
import { FunderRule } from "../entities/funder-rule";
import { MapOfCommittedSalary, MapOfAmount, CommittedSalary, NamedStaff, StaffType } from "../entities/people/staff";
import { BudgetPeriod } from "../entities/peoplePeriod";
import { Budget } from "../entities/project";
import { CommittedSalaryHelper } from "../entities/salary/committedSalary-helper";
import { Inflation, InflationHelper } from "../entities/salary/inflation";
import { Promotion, PromotionHelper } from "../entities/salary/promotion";
import { PromotionForecaster } from "../utils/PromotionForecaster";
import {DateUtil, DateUtil as d} from 'src/app/common/utils/dateUtil';
import { Forecaster } from "../utils/forecaster";
import { PeriodUtil } from "../utils/periodUtil";
import { EditNamedStaffComponent } from 'src/app/people/edit-named-staff/edit-named-staff.component';

export class NamedStaffPrepareHelper {

  static prepareData(funderRule: FunderRule, namedStaff: NamedStaff, budget: Budget): any {
    let namedStaff1 = cloneDeep(namedStaff);
    if (!funderRule) {
      return;
    }
    
    let isPromotion = namedStaff.staffType === StaffType.Academic && namedStaff.salary?.acadPayScale?.level > 0 ? true: false;

    let maxSalaryChangePct: number = funderRule?.maxSalaryChangePct ?? EditNamedStaffComponent.NO_PCT;
    let accPct: number = funderRule?.accPct ?? EditNamedStaffComponent.NO_PCT;
    let superannuationPct: number = funderRule?.superannuationPct ?? EditNamedStaffComponent.NO_PCT;
    let overheadPct: number = funderRule?.overheadPct ?? EditNamedStaffComponent.NO_PCT;

    let salary = namedStaff1.salary
    let budgetPeriod: BudgetPeriod = new BudgetPeriod(budget.budgetStartDate, budget.budgetEndDate);

    // do forecasting
    let inflationDates: Inflation[] =
        new InflationHelper(1,2,maxSalaryChangePct, 1, 11)
            .generateInflationPeriod(DateUtil.today(), budget.budgetEndDate, namedStaff1);
    let forecaster: Forecaster = new Forecaster(
        namedStaff1.peopleType,
        inflationDates,
        budgetPeriod,
        salary
    );
    let promotionForecaster: PromotionForecaster;
    if (isPromotion) {
      let grade = namedStaff1.salary.acadPayScale.grade;
      let level: number = +namedStaff1.salary.acadPayScale.level;
      let lastPromotionDate: string = namedStaff1.salary.lastPromotionDate;
      let promotionDates: Promotion[] =
          new PromotionHelper(d.getDay(lastPromotionDate), d.getMonth(lastPromotionDate), grade, level, maxSalaryChangePct, budget.academicRateCard)
              .generatePromotionPeriod(DateUtil.today(), budget.budgetEndDate);
      console.log('promotionDates', promotionDates);
      promotionForecaster = new PromotionForecaster(
          inflationDates,
          promotionDates,
          budgetPeriod,
          salary
      );
    }
    namedStaff1.forecastedSalaries = isPromotion ? promotionForecaster.forecastSalaries(): forecaster.forecastSalaries();
    console.log(`forecastedSalaries`, namedStaff1.forecastedSalaries);
    if (!budget?.budgetPeriods && budget?.budgetStartDate && budget?.budgetEndDate) {
      budget.budgetPeriods = PeriodUtil.toPeriods({
        startDate: budget?.budgetStartDate,
        endDate: budget?.budgetEndDate,
      });
    }
    let maxSalary: number = namedStaff1.projectRole && namedStaff1.projectRole != '' ? !isNaN(funderRule.fteList.find(i => i.roleName == namedStaff1.projectRole).maxSalary) ? funderRule.fteList.find(i => i.roleName == namedStaff1.projectRole).maxSalary : EditNamedStaffComponent.NO_LIMIT: EditNamedStaffComponent.NO_LIMIT;
    let maxOverhead: number = namedStaff1.projectRole && namedStaff1.projectRole != '' ? !isNaN(funderRule.fteList.find(i => i.roleName == namedStaff1.projectRole).maxOverhead) ? funderRule.fteList.find(i => i.roleName == namedStaff1.projectRole).maxOverhead : EditNamedStaffComponent.NO_LIMIT: EditNamedStaffComponent.NO_LIMIT;
    const budgetPeriodSalaryMap: MapOfCommittedSalary[] = PeriodUtil.toCommittedSalaries(namedStaff1.peopleId, namedStaff1.forecastedSalaries, namedStaff1?.commitments, budget.budgetPeriods, maxSalary, maxOverhead, accPct, superannuationPct, overheadPct);
    namedStaff1.committedSalaryMap = budgetPeriodSalaryMap;
    console.log(`committedSalaryMap`, namedStaff1.committedSalaryMap);

    // pre-calculate FTE, salary, acc, superannuation, overhead
    let totalSalaryMap: MapOfAmount[] = [];
    let fteMap: MapOfAmount[] = [];
    let salaryMap: MapOfAmount[] = [];
    let allowanceMap: MapOfAmount[] = [];
    let accMap: MapOfAmount[] = [];
    let superannuationMap: MapOfAmount[] = [];
    let overheadMap: MapOfAmount[] = [];
    for (let period of budget.budgetPeriods){
      let prefix = namedStaff1.peopleId + '-' + period.startDate;
      let committedSalaries: CommittedSalary[] = namedStaff1.committedSalaryMap?.filter((p) => p.key === prefix).pop()?.value;
      if (committedSalaries){
        fteMap.push({ key: prefix, value: CommittedSalaryHelper.calFTE(committedSalaries, period) });
        let salary1: number = CommittedSalaryHelper.calSalary(committedSalaries);
        salaryMap.push({ key: prefix, value: salary1});
        let allowance1: number = CommittedSalaryHelper.calAllowance(committedSalaries);
        allowanceMap.push({ key: prefix, value: allowance1});
        let acc1: number = CommittedSalaryHelper.calAcc(committedSalaries);
        accMap.push({ key: prefix, value: acc1});
        let superannuation1: number = CommittedSalaryHelper.calSuperannuation(committedSalaries);
        superannuationMap.push({ key: prefix, value: superannuation1});
        let overhead1: number = CommittedSalaryHelper.calOverhead(committedSalaries);
        overheadMap.push({ key: prefix, value: overhead1});
        totalSalaryMap.push({ key: prefix, value: salary1 + allowance1 + acc1 + superannuation1 + overhead1});
      }
    }
    // store result of calculate totalSalary, fte, salary, acc, superannuation, overhead
    namedStaff1.totalSalaryMap = totalSalaryMap;
    namedStaff1.fteMap = fteMap;
    namedStaff1.salaryMap = salaryMap;
    namedStaff1.allowanceMap = allowanceMap;
    namedStaff1.accMap = accMap;
    namedStaff1.superannuationMap = superannuationMap;
    namedStaff1.overheadMap = overheadMap;
    
    return { 
      namedStaff1: namedStaff1,
      maxSalary: maxSalary,
      maxOverhead: maxOverhead
    };
  }
}