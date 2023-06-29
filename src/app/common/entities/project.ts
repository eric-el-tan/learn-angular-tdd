import { Period } from '../utils/periodUtil';
import { UserInfo } from './loginUser';
import { ProfessionalStandardisedRate, AcademicStandardisedRate } from './salary';
import { FunderRule } from './funder-rule';

export interface Project {
  accessType?: string;
  projectId: string;
  projectCode?: string;
  projectName: string;
  principalInvestigator?: string;
  funderRule?: FunderRule;
  useCustomRule?: boolean;
  customRule?: FunderRule;
  faculty?: string;
  deptCode?: string;
  estimatedStartDate?: string;
  period?: number;
  estimatedEndDate?: string;
  budgets?: Budget[];
  modifiedAt?: string;
  modifiedBy?: UserInfo;
  pbrfCategory?: string;
  pbrfSubCategory?: string;
  administrators?: UserInfo[];
  editors?: UserInfo[];
  projectRoles?: ProjectRole[];
  homeDepartment?: string;
  associatedDepartment?: string;
  researchCentreAffiliation?: string;
  archived?: boolean;
}

export interface ProjectRole {
  projectRole: string;
  nameDisplay: string;
  firstName?: string;
  lastName?: string;
  staffUpi?: string;
}

/**
 * Funding Round related to rules
 * TBC: should put fundingMaximumAmt at project level
 */
export interface FundingRound {
  funderName: string; // 'Royal Society of New Zealand'
  fund: string; // 'Marsden'
  fundingRoundName: string; // 'Fast-Start'
}

export interface Budget {
  projectId: string; // reference parent project, if this budget will be saved to individual file
  budgetId: string;
  budgetName: string; // TBC: save default value as 'Draft'
  budgetStartDate: string;
  budgetPeriod?: number;
  budgetPeriods: Period[];
  budgetEndDate: string;
  budgetActivationStartDate?: string;
  budgetActivationEndDate?: string;
  budgetStatus: string;
  locked: boolean;
  value?: number;
  modifiedAt: number; // time of last saved
  modifiedBy?: UserInfo;
  professionalRateCard: ProfessionalStandardisedRate[];
  professionalRateCardModifiedAt?: string;
  academicRateCard: AcademicStandardisedRate[];
  academicRateCardModifiedAt?: string;
  //   waiver: Waiver;
}

//--------------------------------------------------------

// Time 1: when load application
//  PSHR -> professional Ratecard [] --> scope: application   , professionalRateCardModifiedAt: timestamp
//  PSHR -> academic Ratecard []     --> scope: application   , academicRateCardModifiedAt: timestamp


// Time 2: when create Budget
//  get scope: application.professional ratecard [] --> scope: budget, professionalRateCardModifiedAt?: string;
//  get scope: application.academic ratecard []  --> scope: budget,  academicRateCardModifiedAt: timestamp


// when add unnamed Staff / named staff
//  use budget.professional ratecard
