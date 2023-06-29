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
import { GradeBandConfig } from '../configs/gradeBand-config';

export class StaffPrepareHelper {

  static prepareData(funderRule: FunderRule, unnamedStaff: Staff, budget: Budget): any {

    let unnamedStaff1 = cloneDeep(unnamedStaff);
    if (!funderRule) {
      return;
    }

    let isPromotion = unnamedStaff.staffType === StaffType.Academic && unnamedStaff.salary?.acadPayScale?.level > 0 ? true: false;

    let maxSalaryChangePct: number = funderRule?.maxSalaryChangePct ?? EditUnnamedStaffComponent.NO_PCT;
    let accPct: number = funderRule?.accPct ?? EditUnnamedStaffComponent.NO_PCT;
    let superannuationPct: number = funderRule?.superannuationPct ?? EditUnnamedStaffComponent.NO_PCT;
    let overheadPct: number = funderRule?.overheadPct ?? EditUnnamedStaffComponent.NO_PCT;

    let salary = unnamedStaff1.salary;
    let budgetPeriod: BudgetPeriod = new BudgetPeriod(budget.budgetStartDate, budget.budgetEndDate);
    
    let committedPromotionDate: string = unnamedStaff1?.commitments[0]?.startDate ?? budget.budgetStartDate;

    let inflationDates: Inflation[] = new InflationHelper(1, 2, maxSalaryChangePct, 1, 11).generateInflationPeriod(
      d.today(),
      budget.budgetEndDate,
      unnamedStaff1
    );
    let forecaster: Forecaster = new Forecaster(unnamedStaff1.peopleType, inflationDates, budgetPeriod, salary);

    let promotionForecaster: PromotionForecaster;
    if (isPromotion) {
      let grade = unnamedStaff1.salary.acadPayScale.grade;
      let level: number = +unnamedStaff1.salary.acadPayScale.level;
      let promotionDates: Promotion[] = new PromotionHelper(
        d.getDay(committedPromotionDate),
        d.getMonth(committedPromotionDate),
        grade,
        level,
        maxSalaryChangePct,
        budget.academicRateCard
      ).generatePromotionPeriod(committedPromotionDate, budget.budgetEndDate);
      // console.log('promotionDates', promotionDates);
      promotionForecaster = new PromotionForecaster(inflationDates, promotionDates, budgetPeriod, salary);
    }

    unnamedStaff1.forecastedSalaries = isPromotion ? promotionForecaster.forecastSalaries() : forecaster.forecastSalaries();
    console.log(`forecastedSalaries`, unnamedStaff1.forecastedSalaries);

    let maxSalary: number = unnamedStaff1.projectRole && unnamedStaff1.projectRole != '' ? !isNaN(funderRule.fteList.find(i => i.roleName == unnamedStaff1.projectRole).maxSalary) ? funderRule.fteList.find(i => i.roleName == unnamedStaff1.projectRole).maxSalary : EditUnnamedStaffComponent.NO_LIMIT: EditUnnamedStaffComponent.NO_LIMIT;
    let maxOverhead: number = unnamedStaff1.projectRole && unnamedStaff1.projectRole != '' ? !isNaN(funderRule.fteList.find(i => i.roleName == unnamedStaff1.projectRole).maxOverhead) ? funderRule.fteList.find(i => i.roleName == unnamedStaff1.projectRole).maxOverhead : EditUnnamedStaffComponent.NO_LIMIT: EditUnnamedStaffComponent.NO_LIMIT;

    if (!budget?.budgetPeriods && budget?.budgetStartDate && budget?.budgetEndDate) {
      budget.budgetPeriods = PeriodUtil.toPeriods({
        startDate: budget?.budgetStartDate,
        endDate: budget?.budgetEndDate,
      });
    }
    const budgetPeriodSalaryMap: MapOfCommittedSalary[] = PeriodUtil.toCommittedSalaries(unnamedStaff1.peopleId, unnamedStaff1.forecastedSalaries, unnamedStaff1?.commitments, budget.budgetPeriods, maxSalary, maxOverhead, accPct, superannuationPct, overheadPct);
    unnamedStaff1.committedSalaryMap = budgetPeriodSalaryMap;
    console.log(`committedSalaryMap`, unnamedStaff1.committedSalaryMap);

    // pre-calculate FTE, salary, acc, superannuation, overhead
    let totalSalaryMap: MapOfAmount[] = [];
    let fteMap: MapOfAmount[] = [];
    let salaryMap: MapOfAmount[] = [];
    let allowanceMap: MapOfAmount[] = [];
    let accMap: MapOfAmount[] = [];
    let superannuationMap: MapOfAmount[] = [];
    let overheadMap: MapOfAmount[] = [];
    for (let period of budget.budgetPeriods) {
      let prefix = unnamedStaff1.peopleId + '-' + period.startDate;
      let committedSalaries: CommittedSalary[] = unnamedStaff1.committedSalaryMap?.filter((p) => p.key === prefix).pop()?.value;
      if (committedSalaries) {
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
    unnamedStaff1.totalSalaryMap = totalSalaryMap;
    unnamedStaff1.fteMap = fteMap;
    unnamedStaff1.salaryMap = salaryMap;
    unnamedStaff1.allowanceMap = allowanceMap;
    unnamedStaff1.accMap = accMap;
    unnamedStaff1.superannuationMap = superannuationMap;
    unnamedStaff1.overheadMap = overheadMap;

    return { 
      unnamedStaff1: unnamedStaff1,
      maxSalary: maxSalary,
      maxOverhead: maxOverhead
    };
  }
}