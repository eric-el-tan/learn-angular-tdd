import { MileStoneType } from '../salary/milestones';
import { Commitment } from './commitment';
import { PeopleCost } from './peopleCost';
import {IncentiveCard} from './IncentiveData';

export enum StaffType {
  AcademicPlus = 'AcademicPlus',
  Academic = 'Academic',
  Professional = 'Professional',
}
export enum SalaryType {
  Actual = 'Actual',
  Standardised = 'Standardised',
}
export enum IncrementType {
  Inflation = 'Inflation',
  Promotion = 'Promotion',
}
export interface MapOfAmount {
  key: string;    // id-startDate sadad0e12e-2-sada-sdasa-2022-01-15
  value: number;
}

export interface Staff extends PeopleCost {
  staffType: StaffType;
  registerType: string; // Permanent | Fixed Term
  projectRole: string;
  commitments: Commitment[];
  salary: StaffSalary;
  forecastedSalaries: ForecastedSalary[];
  committedSalaryMap: MapOfCommittedSalary[];
  // peopleType = 'Named' && 'Unnamed'
  totalSalaryMap: MapOfAmount[];
  fteMap: MapOfAmount[];
  salaryMap: MapOfAmount[];
  accMap: MapOfAmount[];
  superannuationMap: MapOfAmount[];
  overheadMap: MapOfAmount[];
  allowanceMap: MapOfAmount[];
}

export interface NamedStaff extends Staff {
  staffUpi: string;
  firstName: string;
  lastName: string;
  jobTitle: string; // e.g. 'Senior Research Fellow / Lecturer', may related to staffSalary.payScale.gradeBand
  faculty: string;
  layoffExmptRSN: string; // MAC2021SEC
  incentiveCodes?: IncentiveCard[];
  incentiveCode?: IncentiveCard;
}

/**
 * Salary is per year basis. Assume salary can be changed yearly
 * total salary will be calculated differently
 * salary does not change for professional staff, while salary will be changed/progressed for academic staff
 * use ratecard/payscale for unnamed staff, need to separate 2 salary data structure
 */
export interface StaffSalary {
  baseSalary: number; // api: Base Salary (1 FTE)
  allowances?: Allowance[]; // e.g. 45000 clinical work, extra-allowance for senior management // api: Allowances (type and value, scaled to 1 FTE)
  pctAllowances?: PctAllowance[];
  lastPromotionDate?: string;
  expiryDate?: string; // default: 2099-12-31, or 1 days before the promotion date of the next StaffSalary
  profPayScale?: ProfessionalPayScale;
  acadPayScale?: AcademicPayScale;
  salaryType: SalaryType;
  // contractType: string; // 6 kinds of agreement: Collective Academic/Collective Professional/Collective Medical Acedemics / Individual Professional Grade B-G / Individual Professional Grade H-L / Individual Academic // api: Which contract
}

export interface ForecastedSalary {   // replace derviedStaff: StaffSalary[]
  baseSalary: number;
  allowances: Allowance[];
  pctAllowances: PctAllowance[];
  mileStone: MileStoneType;
  numberOfInflation: number; // for preparePromotionStaffSalaries()
  startDate: string;  // replace: lastPromotionDate
  endDate: string; // replace expiryDate
}

/**
 * Payscale define how salary inflate and progress.
 * available gradeBandType: L-Lecturer, SL-Senior Lecturer, RF-Research Fellow, SRF-Senior Research Fellow, AP-Associate Professor, PR-Professor, DP-Distinguish professor, B-Band for Professional, C-Casual Staff
 * level: Grade L allow level 1-7; Grade SL allow level 1-8, Band: B, C, D, E, F, G, allow only level 1 or simply does not require any level
 */ 
export interface AcademicPayScale {
  grade: string; // Grade: L/SL/RF/SRF/AP/PR
  level: number; // Level: L: 1-7 / SL: 1-8 / RF: 1-7 / SRF: 1-8 / AP: null / PR: null
  scaledSalary: number;
}

export interface ProfessionalPayScale {
  band: string; // Band: B/C/D/E/F/G/H/I/J/K/L
  minimumSalary: number;
  maximumSalary: number;
}

export interface Allowance {
  type: string;
  value: number;
}

export interface PctAllowance {
  type: string;
  pct: number;
}

export interface MapOfCommittedSalary {
  key: string;
  value: CommittedSalary[];
}

export interface CommittedSalary {
  startDate: string;
  endDate: string;
  commitment: number;
  days: number;
  salary: number;
  allowance: number;
  acc: number;
  superannuation: number;
  overhead: number;
  mileStone: string;
  forecastedSalary: ForecastedSalary;
}
