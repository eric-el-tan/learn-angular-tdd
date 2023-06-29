import { Cost } from '../cost/cost';

export enum PeopleType {
  Named = "Named",
  Unnamed = "Unnamed",
  Student = "Student",
  Casual = "Casual",
}

export interface PeopleCost extends Cost {
  peopleId: string;
  nameDisplay: string;
  titleDisplay: string;
  peopleType: PeopleType;
  glcode: string;
}
