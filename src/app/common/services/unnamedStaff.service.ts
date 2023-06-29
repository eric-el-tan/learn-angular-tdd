
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectsService } from './projects.service';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../entities/project';
import { SalaryType, Staff } from '../entities/people/staff';
import { CostType } from '../entities/cost/cost';
import { CostService } from './cost.service';
import { PeopleType } from '../entities/people/peopleCost';

@Injectable({
  providedIn: 'root',
})
export class UnnamedStaffService {
  public apiServer = environment.apiServer;
  public unnamedStaff$ = new BehaviorSubject<Staff>(null);
  public unsavedUnnamedStaff$ = new BehaviorSubject<Staff>(null);

  constructor(private _http: HttpClient, private _costService: CostService) {}

  public unnamedStaffs$ = new BehaviorSubject<Staff[]>(null);

  async addUnnamedStaff(unnamedStaff: Staff) {
    console.log(`addUnnamedStaff ${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs`, unnamedStaff);
    await this._http.post<Staff>(`${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs`, unnamedStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('create unnamedStaff: success!', result);
        this._costService.getCosts(unnamedStaff.projectId, unnamedStaff.budgetId);
      },
      (error) => console.error('create unnamedStaff: error!', error)
    );
  }

  async updateUnnamedStaff(unnamedStaff: Staff) {
    console.log(`updateUnnamedStaff ${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`, unnamedStaff);
    await this._http.patch<Staff>(`${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`, unnamedStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('updateUnnamedStaff: Success!', result);
        this._costService.getCosts(unnamedStaff.projectId, unnamedStaff.budgetId);
      },
      (error) => console.error('updateUnnamedStaff: Error!', error)
    );
  }

  updateUnnamedStaffPromise(unnamedStaff: Staff): Promise<Staff> {
    console.log(`updateUnnamedStaffPromise ${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`, unnamedStaff);
    return this._http.patch<Staff>(`${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`, unnamedStaff)
    .toPromise();
  }

  async deleteUnnamedStaff(unnamedStaff: Staff) {
    console.log(`deleteUnnamedStaff /projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`);
    await this._http.delete<Staff>(`${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteUnnamedStaff: Success!', result);
        this._costService.getCosts(unnamedStaff.projectId, unnamedStaff.budgetId);
      },
      (error) => console.error('deleteUnnamedStaff: Error!', error)
    );
  }

  private static unnamedStaffTemplate: Staff = {
    costId: null,
    costType: CostType.People,
    peopleId: null,
    nameDisplay: 'Unnamed staff 1',
    titleDisplay: '',
    peopleType: PeopleType.Unnamed,
    staffType: null,
    registerType: null,
    projectRole: 'Investigator',
    commitments: [],
    glcode: 'GL01',
    projectId: null,
    budgetId: null,
    modifiedAt: null,
    modifiedBy: null,
    salary: {
      baseSalary: 0.0,
      salaryType: SalaryType.Standardised,
    },
    forecastedSalaries: [],
    committedSalaryMap: [],
    totalSalaryMap: [], 
    fteMap: [], 
    salaryMap: [], 
    accMap: [],
    superannuationMap: [],
    overheadMap: [],
    allowanceMap: [],
  };

  public getInstance(project: Project): Staff {
    let data: Staff = cloneDeep(UnnamedStaffService.unnamedStaffTemplate);
    data.projectId = project?.projectId;
    data.modifiedAt = Date.now();
    return data;
  }
}
