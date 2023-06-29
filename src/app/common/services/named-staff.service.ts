import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {NamedStaff} from "../entities/people/staff";
import {HttpClient} from "@angular/common/http";
import {CostType} from "../entities/cost/cost";
import {PeopleType} from "../entities/people/peopleCost";
import { CostService } from './cost.service';

@Injectable({
  providedIn: 'root'
})
export class NamedStaffService {

  constructor(private _http: HttpClient, private _costService: CostService) {}

  async addNamedStaff(namedStaff: NamedStaff) {
    console.log(`addNamedStaff ${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs`);
    await this._http.post<NamedStaff>(`${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs`, namedStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('create addNamedStaff: success!', result);
        this._costService.getCosts(namedStaff.projectId, namedStaff.budgetId);
      },
      (error) => console.error('create addNamedStaff: error!', error)
    );
  }

  async updateNamedStaff(namedStaff: NamedStaff) {
    console.log(`updateNamedStaff ${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`);
    await this._http.patch<NamedStaff>(`${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`, namedStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('updateNamedStaff: Success!', result);
        this._costService.getCosts(namedStaff.projectId, namedStaff.budgetId);
      },
      (error) => console.error('updateNamedStaff: Error!', error)
    );
  }

  updateNamedStaffPromise(namedStaff: NamedStaff): Promise<NamedStaff> {
    console.log(`updateNamedStaffPromise ${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`);
    return this._http.patch<NamedStaff>(`${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`, namedStaff)
    .toPromise();
  }

  async deleteNamedStaff(namedStaff: NamedStaff) {
    console.log(`deleteNamedStaff /projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`);
    await this._http.delete<NamedStaff>(`${this.apiServer}/projects/${namedStaff.projectId}/budgets/${namedStaff.budgetId}/costs/${namedStaff.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteNamedStaff: Success!', result);
        this._costService.getCosts(namedStaff.projectId, namedStaff.budgetId);
      },
      (error) => console.error('deleteNamedStaff: Error!', error)
    );
  }

    public apiServer = environment.apiServer;
    getInstance(projId):NamedStaff {
        return {
            costId: '',
            costType: CostType.People,
            peopleId: null,
            nameDisplay: 'Select staff',
            titleDisplay: '',
            peopleType: PeopleType.Named,
            staffType: null,
            projectRole: '',
            commitments: [],
            glcode: 'GL01',
            projectId: projId,
            budgetId: null,
            staffUpi: 'nil',
            firstName: 'nil',
            lastName: 'nil',
            jobTitle: 'nil',
            registerType: 'nil',
            layoffExmptRSN: 'nil',
            faculty: 'nil',
            modifiedAt: null,
            modifiedBy: null,
            salary: {
                baseSalary: 0.0,
                allowances: [
                ],
                salaryType: null,
            },
            committedSalaryMap: [],
            forecastedSalaries: [],
            totalSalaryMap: [],
            fteMap: [],
            salaryMap: [],
            accMap: [],
            superannuationMap: [],
            overheadMap: [],
            allowanceMap: [],
        }
    }
}


