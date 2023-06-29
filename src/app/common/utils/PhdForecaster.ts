import { Inflation } from '../entities/salary/inflation';
import { cloneDeep } from 'lodash';
import { BudgetPeriod } from '../entities/peoplePeriod';
import { DateUtil as d } from './dateUtil';
import { MileStoneType } from '../entities/salary/milestones';
import { SalaryData } from '../data/salary.data';
import { ForecastedStudentSalary, StudentSalary } from '../entities/people/student';

const INCREMENT_TYPE_INFLATION = 'inflation';
const INCREMENT_TYPE_PROMOTION = 'promotion';

const DAYS_IN_YEAR = 365;
export class PhdForecaster {
	// private budgetDates: BudgetDates; //TODO: take inflation date / promotion date out of it
  private inflationDates: Inflation[];
  private period: BudgetPeriod;
	private salary: StudentSalary;
	private stipendAnnualIncreasePct: number;
	private tuitionAnnualIncreasePct: number;
  private servicesFeeAnnualIncreasePct: number;
  private insuranceAnnualIncreasePct: number;
  
	constructor(inflationDates: Inflation[], budgetPeriod: BudgetPeriod, salary: StudentSalary, 
    stipendAnnualIncreasePct: number, tuitionAnnualIncreasePct: number, 
    servicesFeeAnnualIncreasePct: number, insuranceAnnualIncreasePct: number
  ) {
    this.inflationDates = inflationDates;
    this.salary = salary;
    this.period = budgetPeriod;
    this.stipendAnnualIncreasePct = stipendAnnualIncreasePct;
    this.tuitionAnnualIncreasePct = tuitionAnnualIncreasePct;
    this.servicesFeeAnnualIncreasePct = servicesFeeAnnualIncreasePct;
    this.insuranceAnnualIncreasePct = insuranceAnnualIncreasePct;
  }

  forecastSalaries(): ForecastedStudentSalary[]{   // TODO: rename to inflate
    let forecastedSalaries: ForecastedStudentSalary[] = [];
    let forecastedSalaryTemplate: ForecastedStudentSalary = {   // replace derviedStaff: StaffSalary[]
      stipend: 0.0,
      tuition: 0.0,
      insurance: 0.0,
      studentService: 0.0,
      mileStone: MileStoneType.PERIOD_START,
      numberOfInflation: 0,
      startDate: '',
      endDate: '',
    };
    
    let salaryEndDate: BudgetPeriod | Inflation | null = undefined;
    let inflateIndex: number = 0;
    let tempStipend: number = 0.0;
    let tempTuition: number = 0.0;
    let tempInsurance: number = 0.0;
    let tempStudentService: number = 0.0;
    while (
      inflateIndex == 0 || // 1st loop
      !(salaryEndDate instanceof BudgetPeriod) && this.inflationDates[inflateIndex] !== undefined // other loops
    ) {
      let originSalary: ForecastedStudentSalary = cloneDeep(forecastedSalaryTemplate);
      
      originSalary.mileStone = 
        inflateIndex == 0 ? MileStoneType.PERIOD_START: 
        MileStoneType.INFLATION;

      originSalary.startDate = 
        inflateIndex == 0 ? this.period.startDate : 
        salaryEndDate instanceof Inflation ? (salaryEndDate as Inflation).inflationDate : 
        "WRONG CASE"; // should not get into this

      originSalary.numberOfInflation = inflateIndex;

      originSalary.stipend = inflateIndex == 0 ? this.salary.stipend :(salaryEndDate as Inflation).inflateSalary(tempStipend, this.stipendAnnualIncreasePct);
      originSalary.tuition = inflateIndex == 0 ? this.salary.tuition :(salaryEndDate as Inflation).inflateSalary(tempTuition, this.tuitionAnnualIncreasePct);
      originSalary.insurance = inflateIndex == 0 ? this.salary.insurance :(salaryEndDate as Inflation).inflateSalary(tempInsurance, this.insuranceAnnualIncreasePct);
      originSalary.studentService = inflateIndex == 0 ? this.salary.studentService :(salaryEndDate as Inflation).inflateSalary(tempStudentService, this.servicesFeeAnnualIncreasePct);

      originSalary.stipend = SalaryData.roundToNearest(originSalary.stipend, 0.01);
      originSalary.tuition = SalaryData.roundToNearest(originSalary.tuition, 0.01);
      originSalary.insurance = SalaryData.roundToNearest(originSalary.insurance, 0.01);
      originSalary.studentService = SalaryData.roundToNearest(originSalary.studentService, 0.01);
      
      tempStipend = originSalary.stipend;
      tempTuition = originSalary.tuition;
      tempInsurance = originSalary.insurance;
      tempStudentService = originSalary.studentService;

      salaryEndDate = PhdForecaster.getMinimumOf(this.period, this.inflationDates[inflateIndex]);
      if (salaryEndDate instanceof BudgetPeriod) {
        originSalary.endDate = (salaryEndDate as BudgetPeriod).endDate;
      } else if (salaryEndDate instanceof Inflation) {
        originSalary.endDate = (salaryEndDate as Inflation).minusOne;
      }
      forecastedSalaries.push(originSalary);
      inflateIndex++;
    }

    // last loop
    let lastSalary: ForecastedStudentSalary = cloneDeep(forecastedSalaryTemplate);
    lastSalary.mileStone = MileStoneType.PERIOD_END;
    lastSalary.startDate = 
      salaryEndDate instanceof Inflation ? (salaryEndDate as Inflation).inflationDate: 
      "WRONG CASE";
    lastSalary.numberOfInflation = inflateIndex;

    lastSalary.stipend = inflateIndex == 0 ? this.salary.stipend : (salaryEndDate as Inflation).inflateSalary(tempStipend, this.stipendAnnualIncreasePct);
    lastSalary.tuition = inflateIndex == 0 ? this.salary.tuition : (salaryEndDate as Inflation).inflateSalary(tempTuition, this.tuitionAnnualIncreasePct);
    lastSalary.insurance = inflateIndex == 0 ? this.salary.insurance : (salaryEndDate as Inflation).inflateSalary(tempInsurance, this.insuranceAnnualIncreasePct);
    lastSalary.studentService = inflateIndex == 0 ? this.salary.studentService : (salaryEndDate as Inflation).inflateSalary(tempStudentService, this.servicesFeeAnnualIncreasePct);

    lastSalary.stipend = SalaryData.roundToNearest(lastSalary.stipend, 0.01);
    lastSalary.tuition = SalaryData.roundToNearest(lastSalary.tuition, 0.01);
    lastSalary.insurance = SalaryData.roundToNearest(lastSalary.insurance, 0.01);
    lastSalary.studentService = SalaryData.roundToNearest(lastSalary.studentService, 0.01);

    lastSalary.endDate = this.period.endDate;
    forecastedSalaries.push(lastSalary);

    forecastedSalaries = forecastedSalaries.filter((a) => d.moment(a.startDate) < d.moment(a.endDate));
    forecastedSalaries.sort((a,b) => d.moment(a.startDate).diff(d.moment(b.startDate)));
    return forecastedSalaries;
  }

  static getMinimumOf(period: BudgetPeriod, inflationDate: Inflation): BudgetPeriod | Inflation | null {
    if (!period || !inflationDate)
      return null;
    if (!inflationDate)
      return period;
    if ( d.moment(period.endDate) < d.moment(inflationDate.minusOne)) {
      return period;
    } else {
      return inflationDate;
    }
  }
}