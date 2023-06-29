import {Allowance, PctAllowance, StaffType} from "./people/staff";

export interface PsStaff {
  staffType?: StaffType;
  NATIONAL_ID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMPL_RCD: string;
  BUSINESS_UNIT_DESC: string;
  DEPT_DESCR: string;
  GRADE: string;
  STEP: number;
  STEP_ENTRY_DT: string;
  TERMINATION_DT?: string;
  TERMINATION_DT_ori?: string;
  STEP_ENTRY_DT_ori?: string;
  POSITION_DESCR?: string;
  COMP_RATE_DESCR?: string;
  UOA_COMPRATE?: number;
  UOA_REG_TEMP_DESCR?: string;
  LAYOFF_EXEMPT_RSN?: string;
  allowances?: Allowance[];
  pctAllowances?: PctAllowance[];
}

export interface NamePsStaff{
  employee: PsStaff;
  similarity: number;
}

export interface StandardWage{
  gradeBand: string;
  level: number;
  scaledSalary: number;
  minimumSalary: number;
  maximumSalary: number;
}

export interface PsRatecard {
  GRADE: string;
  MIN_RT_ANNUAL: number;
  MAX_RT_ANNUAL: number;
}
