import { UserInfo } from "../loginUser";

export enum CostType {
  People = "People",
  NonPeople = "NonPeople",
}

export interface Cost {
  projectId: string;
  budgetId: string;
  costId: string;
  costType: CostType;
  notes?: string;
  modifiedAt?: number;
  modifiedBy?: UserInfo;
  costTotal?: number;
}