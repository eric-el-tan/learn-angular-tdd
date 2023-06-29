export interface IncentiveData{
    id: string;
    upi: string;
    codes: IncentiveCard[]
}

export interface IncentiveCard {
    incentiveCode: string;
    departmentCode: string;
    faculty: string;
    employeeRecord: string;
}

export enum IncentiveAccess {
    First="first",
    Admin="admin"

}
