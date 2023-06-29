import { DateUtil } from 'src/app/common/utils/dateUtil';
import { cloneDeep } from 'lodash';
import { FunderRule } from "../entities/funder-rule";
import { MapOfAmount } from "../entities/people/staff";
import { BudgetPeriod } from "../entities/peoplePeriod";
import { Budget } from "../entities/project";
import { Inflation, InflationHelper } from "../entities/salary/inflation";
import { PeriodUtil } from "../utils/periodUtil";
import { Student, StudentType, StudentSalary, MapOfCommittedStudentSalary, CommittedStudentSalary } from '../entities/people/student';
import { CommittedStudentSalaryHelper } from '../entities/salary/committedStudentSalary-helper';
import { PhdForecaster } from '../utils/PhdForecaster';
import { SalaryService } from './salary.service';

export class StudentPrepareHelper {

  static prepareData(funderRule: FunderRule, student: Student, budget: Budget): Student {

    let student1 = cloneDeep(student);

    if (!funderRule) {
      return;
    }
    if (funderRule.phdStipendAnnualIncreasePct < 0){
      console.error(`Budget: ${budget.budgetId} missing funderRule.phdStipendAnnualIncreasePct`);
    }
    if (funderRule.phdTuitionAnnualIncreasePct < 0){
      console.error(`Budget: ${budget.budgetId} missing funderRule.phdTuitionAnnualIncreasePct`);
    }

    student1.studentSalary.stipend = 
      student1.stipend && student1.studentType == StudentType.PhD ? funderRule?.phdStipendAnnualLimit :
      student1.stipend && student1.studentType == StudentType.Masters ? funderRule?.mastersStipendAnnualLimit : 0.0;
    student1.studentSalary.tuition = 
      student1.tuition && student1.studentType == StudentType.PhD ? SalaryService.getDoctoralTuitionFee(student1.international, '2023', 'philosophy') :
      student1.tuition && student1.studentType == StudentType.Masters ? SalaryService.getMasterTuitionFee(student1.international, '2023', student1.masterFaculty, student1.masterBand) : 0.0;
    if (student1.studentType == StudentType.Masters) {
      student1.studentSalary.tuition *= 120;
    }    
    student1.studentSalary.insurance = student1.tuition && student1.international && funderRule?.allowInternational ? SalaryService.getInsurance('2023') : 0.0;
    student1.studentSalary.studentService = student1.tuition && funderRule?.includeServiceFee ? SalaryService.getStudentService('2023'): 0.0;

    // funderRule annual increase percentage
    let stipendAnnualIncreasePct: number = 
      student1.studentType == StudentType.PhD ? funderRule?.phdStipendAnnualIncreasePct ?? 0.0: 
      student1.studentType == StudentType.Masters ? funderRule?.mastersStipendAnnualIncreasePct ?? 0.0: 
      0.0;
    let tuitionAnnualIncreasePct: number = 
      student1.studentType == StudentType.PhD ? funderRule?.phdTuitionAnnualIncreasePct ?? 0.0: 
      student1.studentType == StudentType.Masters ? funderRule?.mastersTuitionAnnualIncreasePct ?? 0.0: 
      0.0;
    let servicesFeeAnnualIncreasePct: number = funderRule?.includeServiceFee ? funderRule?.servicesFeeAnnualIncreasePct: 0.0;
    let insuranceAnnualIncreasePct: number = funderRule?.allowInternational ? funderRule?.insuranceAnnualIncreasePct: 0.0;
    

    let salary: StudentSalary = student1.studentSalary;
    let budgetPeriod: BudgetPeriod = new BudgetPeriod(budget.budgetStartDate, budget.budgetEndDate);
    let inflationDates: Inflation[] = 
      new InflationHelper(1, 2, 2, 1, 11)
      .generateInflationPeriod(DateUtil.today(), budget.budgetEndDate, student1);
    let phdForecaster: PhdForecaster = new PhdForecaster(
      inflationDates,
      budgetPeriod,
      salary,
      stipendAnnualIncreasePct,
      tuitionAnnualIncreasePct,
      servicesFeeAnnualIncreasePct,
      insuranceAnnualIncreasePct
    );

    let tuitionLimit =
        student1.studentType == StudentType.PhD ? funderRule?.phdTuitionAnnualLimit :
            student1.studentType == StudentType.Masters ? funderRule?.mastersTuitionAnnualLimit :
                0.0;
    let effectiveStartDate: string = funderRule.effectiveStartDate;
    
    student1.forecastedStudentSalaries = phdForecaster.forecastSalaries();
    budget.budgetPeriods = PeriodUtil.toPeriods({
      startDate: budget?.budgetStartDate,
      endDate: budget?.budgetEndDate,
    });
    const budgetPeriodSalaryMap: MapOfCommittedStudentSalary[] = PeriodUtil.toCommittedStudentSalaries(student1.peopleId, student1.forecastedStudentSalaries, student1?.commitments, budget.budgetPeriods, tuitionLimit, tuitionAnnualIncreasePct, effectiveStartDate);

    student1.committedStudentSalaryMap = budgetPeriodSalaryMap;

    let totalSalaryMap: MapOfAmount[] = [];
    let fteMap: MapOfAmount[] = [];
    let stipendMap: MapOfAmount[] = [];
    let tuitionMap: MapOfAmount[] = [];
    let insuranceMap: MapOfAmount[] = [];
    let studentServiceMap: MapOfAmount[] = [];
    for (let period of budget.budgetPeriods){
      let prefix = student1.peopleId + '-' + period.startDate;
      let committedSalaries: CommittedStudentSalary[] = student1.committedStudentSalaryMap?.filter((p) => p.key === prefix).pop()?.value;
      if (committedSalaries){
        fteMap.push({ key: prefix, value: CommittedStudentSalaryHelper.calFTE(committedSalaries, period) });
        let stipend1 = CommittedStudentSalaryHelper.calStipend(committedSalaries);
        stipendMap.push({ key: prefix, value: stipend1 });
        let tuition1 = CommittedStudentSalaryHelper.calTuition(committedSalaries);
        tuitionMap.push({ key: prefix, value: tuition1});
        let insurance1 = CommittedStudentSalaryHelper.calInsurance(committedSalaries);
        insuranceMap.push({ key: prefix, value: insurance1});
        let studentService1 = CommittedStudentSalaryHelper.calStudentService(committedSalaries);
        studentServiceMap.push({ key: prefix, value: studentService1});
        totalSalaryMap.push({ key: prefix, value: stipend1+tuition1+insurance1+studentService1 });
      }
    }
    student1.totalSalaryMap = totalSalaryMap;
    student1.fteMap = fteMap;
    student1.stipendMap = stipendMap;
    student1.tuitionMap = tuitionMap;
    student1.insuranceMap = insuranceMap;
    student1.studentServiceMap = studentServiceMap;

    return student1;
  }
}