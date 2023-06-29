import { Cost, CostType } from './../entities/cost/cost';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectsService } from './projects.service';
import { BehaviorSubject } from 'rxjs';

import { User } from '../entities/user';
import { Project } from '../entities/project';
import { CasualStaff } from '../entities/people/casualStaff';
import { CasualStaffData } from '../data/casualStaff.data';
import { CostService } from './cost.service';
import { PeopleType } from '../entities/people/peopleCost';
@Injectable({
  providedIn: 'root',
})
export class CasualStaffService {
  public apiServer = environment.apiServer;
  public casualStaffs$ = new BehaviorSubject<CasualStaff>(null);
  public unsavedCasualStaff$ = new BehaviorSubject<CasualStaff>(null);
  constructor(private _http: HttpClient, private _projectsService: ProjectsService, private _costService: CostService) {}

  // addCasualStaff(casualStaff: CasualStaff) {
  //   casualStaff.peopleId = Date.now().toString();
  //   console.log(`casualStaff: `, casualStaff);
  //   CasualStaffData.casualStaffs = CasualStaffService.add(casualStaff, CasualStaffData.casualStaffs);
  //   this.casualStaffs$.next(CasualStaffData.casualStaffs);
  // }
  async addCasualStaff(casualStaff: CasualStaff) {
    console.log(`addCasualStaff ${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs`);
    await this._http.post<CasualStaff>(`${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs`, casualStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('create casualStaff: success!', result);
        this._costService.getCosts(casualStaff.projectId, casualStaff.budgetId);
      },
      (error) => console.error('create casualStaff: error!', error)
    );
  }

  async updateCasualStaff(casualStaff: CasualStaff) {
    console.log(`updateCasualStaff ${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`);
    await this._http.patch<CasualStaff>(`${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`, casualStaff)
    .toPromise()
    .then(
      (result) => {
        console.log('updateCasualStaff: Success!', result);
        this._costService.getCosts(casualStaff.projectId, casualStaff.budgetId);
      },
      (error) => console.error('updateCasualStaff: Error!', error)
    );
  }

  updateCasualStaffPromise(casualStaff: CasualStaff): Promise<CasualStaff> {
    console.log(`updateCasualStaffPromise ${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`, casualStaff);
    return this._http.patch<CasualStaff>(`${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`, casualStaff)
    .toPromise();
  }

  async deleteCasualStaff(casualStaff: CasualStaff) {
    console.log(`deleteCasualStaff /projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`);
    await this._http.delete<CasualStaff>(`${this.apiServer}/projects/${casualStaff.projectId}/budgets/${casualStaff.budgetId}/costs/${casualStaff.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteCasualStaff: Success!', result);
        this._costService.getCosts(casualStaff.projectId, casualStaff.budgetId);
      },
      (error) => console.error('deleteCasualStaff: Error!', error)
    );
  }

  private static casualStaffTemplate: CasualStaff = {
    costId: null,
    costType: CostType.People,
    peopleId: null,
    nameDisplay: null,
    titleDisplay: '',
    peopleType: PeopleType.Casual,
    glcode: null,
    projectId: null,
    budgetId: null,
    accMap: [],
    casualCommitments: [],
    casualSalaryMap: [],
    kiwiSaverMap: [],
    holidayPayMap: [],
    totalSalaryMap: []
  };
  
  public getInstance(project: Project): CasualStaff {
    let data: CasualStaff = cloneDeep(CasualStaffService.casualStaffTemplate);
    data.projectId = project?.projectId;
    data.modifiedAt = Date.now();
    return data;
  }
}