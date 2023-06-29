/**
 * acc, superannuation, overhead, inflation: are percentage of the basic salary
 * year: these percentages will be reviewed by the univerity every year
 */
 export interface UniversityRule {
  ruleName: string; // ROC
  year: string;   // e.g. 2020, 2021, 2022
  acc: number;    // percentage of the basicSalary
  superannuation: number; // percentage of the basicSalary, Super + Kiwisaver percentage (employer contribution)
  overhead: number; // percentage of the basicSalary
  inflation: number; // percentage of the basicSalary
  inflationDate: string; // 2021-02-01
  doctoralCost: StudentCost;
  masterCost: StudentCost;
  kiwiSaver: number; // percentage of the basicSalary
  holidayPay: number; // percentage of the basicSalary
}

export interface StudentCost {
  stipend: number;
  insurance: number;
}

export interface DoctoralRate {
  name: string; // domestic, international
  year: string; // 2021
  tuitions: Tuition[];
}

export interface Tuition {
  programme: string;
  fee: number;
}