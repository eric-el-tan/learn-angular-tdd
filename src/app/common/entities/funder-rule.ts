import { UserInfo } from './loginUser';
/**
 * acc, superannuation, overhead, inflation: are percentage of the basic salary
 * year: these percentages will be reviewed by the univerity every year
 */
 export interface FunderRule {
  // funder
  ruleId: string; // random id
  ruleName: string; // Marsden Fast Start 2022
  funderName: string; // The Royal Society
  fund: string; // Marsden
  fundingRoundName: string; // Fast Start
  pbrfCategory: string;
  pbrfSubCategory: string;
  // general2
  isActive: boolean;
  effectiveStartDate: string;
  period: number; // 1,3,5 yrs
  totalFundingAmt: number;
  // staff
  maxSalaryChangePct: number;
  overheadPct: number;
  accPct: number;
  superannuationPct: number;
  fteList: FunderRuleFte[];
  // student
  phdStipendAnnualLimit: number; // Value (Each Year)
  phdStipendAnnualIncreasePct: number;
  phdTuitionAnnualLimit: number; // Value (Each Year)
  phdTuitionAnnualIncreasePct: number;
  mastersStipendAnnualLimit: number; // Value (Each Year)
  mastersStipendAnnualIncreasePct: number;
  mastersTuitionAnnualLimit: number; // Value (Each Year)
  mastersTuitionAnnualIncreasePct: number;
  includeServiceFee: boolean;
  servicesFeeAnnualIncreasePct: number;
  allowInternational: boolean; 
  insuranceAnnualIncreasePct: number;
  // direct cost
  directCostAnnualLimit: number; // Value (Each Year)

  modifiedAt?: string;
  modifiedBy?: UserInfo;
}

export interface FunderRuleFte {
  roleName: string;
  maxSalary: number;
  maxOverhead: number;
}