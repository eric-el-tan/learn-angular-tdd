import { PeopleCost } from "./peopleCost";
import { MapOfAmount } from "./staff";

export interface CasualStaff extends PeopleCost {
  projectRole?: string;
  totalSalaryMap: MapOfAmount[];
  accMap: MapOfAmount[];
  casualCommitments: CasualCommitment[];
  casualSalaryMap: MapOfAmount[];
  holidayPayMap: MapOfAmount[];
  kiwiSaverMap: MapOfAmount[];
}

export interface CasualCommitment {
  startDate: string,  
  endDate: string,
  hours: number,
  hourlyRate: number,
}