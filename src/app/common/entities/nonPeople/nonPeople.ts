import { Cost } from "../cost/cost";

export enum NonPeopleType {
  Direct = 'Direct',
  Subcontracting = 'Subcontracting',
  ContractForService = 'ContractForService'
}

export interface NonPeopleCost extends Cost {
  nonPeopleId: string;
  nonPeopleType: NonPeopleType;       // Direct / Subcontracting / ContractForService
  nonPeopleDescription: string;    // e.g. 'Domestic Travel', short description
  costPeriods: MapOfCostPeriod[];
}

export interface MapOfCostPeriod {
  key: string;               // id-startDate 'fd23r3fsa-d1wee2dq1d-dqwa8ed1d-dadas09d12e-01/01/2023' 
  value: number;             // 7500
}