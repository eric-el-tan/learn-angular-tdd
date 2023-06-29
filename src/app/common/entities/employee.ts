export interface Employee {
  employeeID: string; // ,
  academicStaffFTE: number; // 0,
  professionalStaffFTE: number; // 0,
  uniServicesFTE: number; // 0,
  eftsOrganisation: string;
  eftsOrganisationDescription: string;
  nominatedAcademicUnit: string;
  nominatedAcademicUnitDescription: string;
  job: EmployeeJob[];
  requestTimeStamp: string; // "2021-09-12T06:12:51.694Z",
} 

export interface EmployeeJob {
  company: string;
  costCentre: string;
  departmentDescription: string;
  departmentID: string;
  effectiveDate: string;
  effectiveSequence: number;
  employeeRecord: number;
  employeeStatus: string;
  employeeType: string;
  fullTimeEquivalent: number;
  hrStatus: string;
  jobCode: string;
  jobCodeDescription: string;
  jobEndDate: string;
  jobGrade: string;
  jobIndicator: string;
  jobStartDate: string;
  lastHRaction: string;
  location: string;
  locationDescription: string;
  organizationalRelation: string;
  parentDepartmentDescription: string;
  poiType: string;
  positionDescription: string;
  positionNumber: string;
  primaryActivityCentreDeptDescription: string;
  primaryActivityCentreDeptID: string;
  reportsToPosition: string;
  salAdminPlan: string;
  standardHours: number;
  supervisorID: string;
  updatedDateTime: string;
}
/*
{
  "academicStaffFTE": 0,
  "employeeID": "string",
  "professionalStaffFTE": 0,
  "requestTimeStamp": "2021-09-12T06:12:51.694Z",
  "uniServicesFTE": 0,
  "job": [
    {
      "company": "string",
      "costCentre": "string",
      "departmentDescription": "string",
      "departmentID": "string",
      "effectiveDate": "2021-09-12",
      "effectiveSequence": 0,
      "employeeRecord": 0,
      "employeeStatus": "string",
      "employeeType": "string",
      "fullTimeEquivalent": 0,
      "hrStatus": "string",
      "jobCode": "string",
      "jobCodeDescription": "string",
      "jobEndDate": "2021-09-12",
      "jobGrade": "string",
      "jobIndicator": "string",
      "jobStartDate": "2021-09-12",
      "lastHRaction": "string",
      "location": "string",
      "locationDescription": "string",
      "organizationalRelation": "string",
      "parentDepartmentDescription": "string",
      "poiType": "string",
      "positionDescription": "string",
      "positionNumber": "string",
      "primaryActivityCentreDeptDescription": "string",
      "primaryActivityCentreDeptID": "string",
      "reportsToPosition": "string",
      "salAdminPlan": "string",
      "standardHours": 0,
      "supervisorID": "string",
      "updatedDateTime": "2021-09-12T06:12:51.694Z"
    }
  ],
}
*/  