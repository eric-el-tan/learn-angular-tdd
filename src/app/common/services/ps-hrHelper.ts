import { Allowance, NamedStaff, PctAllowance, SalaryType, Staff, StaffSalary, StaffType } from './../entities/people/staff';
import { cloneDeep } from 'lodash';
import { PsStaff } from 'src/app/common/entities/psStaff';
import { StaffConfig } from '../configs/staff-config';
import { Budget } from '../entities/project';
import {SalaryData} from '../data/salary.data';
import { CurrentUser } from '../entities/user';

export class PshrHelper {

  static get allowancesAllowed() {
    return [
    'Admin Allowance',
    'Recruitment and Retention Allc',
    'Recruitment Allowance',
    'Retention Allowance'
    ]
  }
 
  static get pctAllowancesAllowed() {
    return [
      'Medical Loading',
      'Retention Allowance Pct',
    ]
  }

  static transformAllowance(psStaffs: PsStaff[]): PsStaff{
    console.log(`psStaffs`, psStaffs);
    let clonedPsStaff: PsStaff = cloneDeep(psStaffs.find(i => i.COMP_RATE_DESCR == 'Base Salary'));
    let allowances: Allowance[] = psStaffs.filter(i => this.allowancesAllowed.includes(i.COMP_RATE_DESCR))
      .map(i => { return {"type": i.COMP_RATE_DESCR, "value": i.UOA_COMPRATE}; }); //
    clonedPsStaff.allowances = allowances;
    let pctAllowances: PctAllowance[] = psStaffs.filter(i => this.pctAllowancesAllowed.includes(i.COMP_RATE_DESCR))
      .map(i => { 
        console.log(`PctAllowance: type: ${i.COMP_RATE_DESCR}, pct: ${i.UOA_COMPRATE} / ${clonedPsStaff.UOA_COMPRATE} = ${i.UOA_COMPRATE / clonedPsStaff.UOA_COMPRATE}`);
        return {
          "type": i.COMP_RATE_DESCR, "pct": i.UOA_COMPRATE / clonedPsStaff.UOA_COMPRATE 
        }; 
      });
    clonedPsStaff.pctAllowances = pctAllowances;
    console.log(`clonedPsStaff`, clonedPsStaff);
    return clonedPsStaff;
  }

  static isLoggedInUserAnAdmin(currentUser:CurrentUser){
    return (currentUser.isToolAdmin || currentUser.isResearchAdmin);
  }

  static isLoggedInUserSameAsSelectedPerson(selectedPersonUpi:string, loggedInUserUpi:string) {
    return selectedPersonUpi.toLowerCase() == loggedInUserUpi.toLowerCase();
  }

  static toNamedStaff(namedStaff: NamedStaff, psStaffWage: PsStaff, budget: Budget, currentUser: CurrentUser): NamedStaff {
    namedStaff.nameDisplay = psStaffWage.FIRST_NAME + " " + psStaffWage.LAST_NAME;
    namedStaff.staffUpi = psStaffWage.NATIONAL_ID;
    namedStaff.firstName = psStaffWage.FIRST_NAME;
    namedStaff.lastName = psStaffWage.LAST_NAME;
    namedStaff.staffType = StaffConfig.toStaffType(psStaffWage.GRADE);
    namedStaff.registerType = psStaffWage.UOA_REG_TEMP_DESCR;
    namedStaff.titleDisplay = 
      namedStaff.staffType == StaffType.AcademicPlus ? StaffConfig.toStaffGrade(psStaffWage.GRADE) : 
      namedStaff.staffType == StaffType.Academic? StaffConfig.toStaffGrade(psStaffWage.GRADE)+ " " + psStaffWage.STEP :
      namedStaff.staffType == StaffType.Professional? StaffConfig.toStaffGrade(psStaffWage.GRADE) : '';

    let staffSalary: StaffSalary = null;

    if (namedStaff.staffType == StaffType.AcademicPlus 
          && (PshrHelper.isLoggedInUserSameAsSelectedPerson(namedStaff.staffUpi, currentUser.staffUpi) 
            || PshrHelper.isLoggedInUserAnAdmin(currentUser))
        ) {
      staffSalary = {
        baseSalary: psStaffWage.UOA_COMPRATE,
        allowances: psStaffWage?.allowances ?? [],
        pctAllowances: psStaffWage?.pctAllowances ?? [],
        acadPayScale: {
          grade: StaffConfig.toStaffGrade(psStaffWage.GRADE),
          level: psStaffWage.STEP ?? null,
          scaledSalary: psStaffWage.UOA_COMPRATE,
        },
        lastPromotionDate: psStaffWage.STEP_ENTRY_DT,
        expiryDate: psStaffWage.TERMINATION_DT,
        salaryType: SalaryType.Actual
      };
    } else if (namedStaff.staffType == StaffType.AcademicPlus) {
      const academicPayScale = cloneDeep(budget.academicRateCard).find((i)=> i.grade == psStaffWage.GRADE);
      staffSalary = {
        baseSalary: academicPayScale.scaledSalary,
        allowances: psStaffWage?.allowances ?? [],
        pctAllowances: psStaffWage?.pctAllowances ?? [],
        acadPayScale: {
          grade: StaffConfig.toStaffGrade(academicPayScale.grade),
          level: academicPayScale.level,
          scaledSalary: academicPayScale.scaledSalary,
        },
        lastPromotionDate: psStaffWage.STEP_ENTRY_DT,
        expiryDate: psStaffWage.TERMINATION_DT,
        salaryType: SalaryType.Standardised
      };

    }
    else if (namedStaff.staffType == StaffType.Academic) {
      const academicPayScale = cloneDeep(budget.academicRateCard).find((i)=> i.grade == psStaffWage.GRADE && i.level == psStaffWage.STEP);
      staffSalary = {
        baseSalary: academicPayScale.scaledSalary,
        allowances: psStaffWage?.allowances ?? [],
        pctAllowances: psStaffWage?.pctAllowances ?? [],
        acadPayScale: academicPayScale,
        lastPromotionDate: psStaffWage.STEP_ENTRY_DT,
        expiryDate: psStaffWage.TERMINATION_DT,
        salaryType: SalaryType.Standardised
      };
      staffSalary.acadPayScale.grade = StaffConfig.toStaffGrade(academicPayScale.grade);
    } else if (namedStaff.staffType == StaffType.Professional) {
      const profPayScale = cloneDeep(budget.professionalRateCard).find((i)=> i.band == psStaffWage.GRADE);
      staffSalary = {
        baseSalary: SalaryData.roundToNearest(psStaffWage.UOA_COMPRATE, 5000),
        allowances: psStaffWage?.allowances ?? [],
        pctAllowances: psStaffWage?.pctAllowances ?? [],
        profPayScale: profPayScale,
        lastPromotionDate: psStaffWage.STEP_ENTRY_DT,
        expiryDate: psStaffWage.TERMINATION_DT,
        salaryType: SalaryType.Standardised
      };
    }
    namedStaff.salary = staffSalary;
    return namedStaff;
  }
}
