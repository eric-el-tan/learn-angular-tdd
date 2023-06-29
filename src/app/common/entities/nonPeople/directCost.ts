import { NonPeopleCost } from './nonPeople';

export interface DirectCost extends NonPeopleCost {
  directCostCategory: string;   // Equipment/Travel and Accommodation
  directCostExpenditureType: string;       // CAPEX or OPEX
  directCostDescription: string;        // long description
}
