import { Injectable } from "@angular/core";
import { CostType } from "../entities/cost/cost";
import { CasualStaff } from "../entities/people/casualStaff";
import { PeopleType } from "../entities/people/peopleCost";

@Injectable({
  providedIn: 'root',
})
export class CasualStaffData {
  public static casualStaffs: CasualStaff[] = [
    {
      costId: null,
      costType: CostType.People,
      peopleId: "1663910475055",
      nameDisplay: "Unnamed",
      titleDisplay: "titleDisplay",
      peopleType: PeopleType.Unnamed,
      glcode: "GL01",
      projectId: "1632776387871",
      budgetId: "1632776419387",
      totalSalaryMap: [],
      accMap: [],
      casualCommitments: [],
      casualSalaryMap: [],
      kiwiSaverMap: [],
      holidayPayMap: [],
    }
  ];
}