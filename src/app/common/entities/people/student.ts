import { MileStoneType } from '../salary/milestones';
import { Commitment } from './commitment';
import { PeopleCost } from './peopleCost';
import { MapOfAmount } from '../people/staff';

export enum StudentType {
  PhD = 'PhD',
  Masters = 'Masters',
}

export interface Student extends PeopleCost {
  studentType: StudentType; // programme: PhD, Masters
  stipend: boolean;
  tuition: boolean;
  international: boolean;
  masterFaculty: string; // e.g. art, law
  masterBand: string; // normal, premium
  commitments: Commitment[];
  studentSalary: StudentSalary;
  forecastedStudentSalaries: ForecastedStudentSalary[];
  committedStudentSalaryMap: MapOfCommittedStudentSalary[];
  totalSalaryMap: MapOfAmount[];
  fteMap: MapOfAmount[];
  stipendMap: MapOfAmount[];
  tuitionMap: MapOfAmount[];
  insuranceMap: MapOfAmount[];
  studentServiceMap: MapOfAmount[];
}

export interface StudentSalary {
  stipend: number;
  tuition: number;
  insurance: number;
  studentService: number;
}

export interface ForecastedStudentSalary extends StudentSalary {
  // replace derviedStaff: StaffSalary[]
  mileStone: MileStoneType;
  numberOfInflation: number; // for preparePromotionStaffSalaries()
  startDate: string; // replace: lastPromotionDate
  endDate: string; // replace expiryDate
}

export interface MapOfCommittedStudentSalary {
  key: string;
  value: CommittedStudentSalary[];
}

export interface CommittedStudentSalary {
  startDate: string;
  endDate: string;
  commitment: number;
  stipend: number;
  tuition: number;
  insurance: number;
  studentService: number;
  forecastedStudentSalary: ForecastedStudentSalary;
}
