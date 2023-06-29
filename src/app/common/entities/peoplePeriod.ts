import { StudentSalary } from "./people/student";

export class BudgetPeriod {
  startDate: string;
  endDate: string;

  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export interface StudentSalaryPeriod {
  startDate: string;
  endDate: string;
  commitment: number;
  studentSalary: StudentSalary;
}

export interface ProjectPeriod {
  startDate: string;
  endDate: string;
}

export interface SalaryPeriod {
  startDate: string;
  endDate: string;
  commitment: number;
  // staffSalary: StaffSalary;
}

