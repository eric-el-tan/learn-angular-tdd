import { NonPeopleCost } from "./nonPeople";

export interface ContractForServiceCost extends NonPeopleCost {  // ContractForServiceCost share same data structure
  institution: string;    // dropdown
}