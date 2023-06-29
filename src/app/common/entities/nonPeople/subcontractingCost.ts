import { NonPeopleCost } from "./nonPeople";

export interface SubcontractingCost extends NonPeopleCost {  // ContractForServiceCost share same data structure
  institution: string;    // dropdown
}