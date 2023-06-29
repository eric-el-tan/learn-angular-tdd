import { Budget } from 'src/app/common/entities/project';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../entities/project';
import { CostType } from '../entities/cost/cost';
import { CostService } from './cost.service';
import { NonPeopleType } from '../entities/nonPeople/nonPeople';
import { multicast } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SubcontractingCost } from '../entities/nonPeople/subcontractingCost';
import { ContractForServiceCostService } from './contractForServiceCost.service';

@Injectable({
  providedIn: 'root',
})
export class SubcontractingCostService {
  public apiServer = environment.apiServer;
  public subcontractingCosts: SubcontractingCost[] = [];
  public subcontractingCost$ = new BehaviorSubject<SubcontractingCost>(null);
  public unsavedSubcontractingCost$ = new BehaviorSubject<SubcontractingCost>(null);

  constructor(private _http: HttpClient, private _costService: CostService) {}

  public subcontractingCosts$ = new BehaviorSubject<SubcontractingCost[]>(null);

  async addDirectCostLocally(subcontractingCost: SubcontractingCost) {
    this.subcontractingCosts.push(subcontractingCost);
    this.subcontractingCosts$.next(this.subcontractingCosts);
  }

  async addSubcontractingCost(subcontractingCost: SubcontractingCost) {
    console.log(`addSubcontractingCost ${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs`, subcontractingCost);
    await this._http.post<SubcontractingCost>(`${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs`, subcontractingCost)
    .toPromise()
    .then(
      (result) => {
        console.log('create subcontractingCost: success!', result);
        this._costService.getCosts(subcontractingCost.projectId, subcontractingCost.budgetId);
      },
      (error) => console.error('create subcontractingCost: error!', error)
    );
  }

  async updateSubcontractingCost(subcontractingCost: SubcontractingCost) {
    console.log(`updateSubcontractingCost ${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs/${subcontractingCost.costId}`, subcontractingCost);
    await this._http.patch<SubcontractingCost>(`${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs/${subcontractingCost.costId}`, subcontractingCost)
    .toPromise()
    .then(
      (result) => {
        console.log('updateSubcontractingCost: Success!', result);
        this._costService.getCosts(subcontractingCost.projectId, subcontractingCost.budgetId);
      },
      (error) => console.error('updateSubcontractingCost: Error!', error)
    );
  }

  async upsertSubcontractingCost(subcontractingCost: SubcontractingCost) {
    console.log(`upsertSubcontractingCost ${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/upsertCosts`, subcontractingCost);
    await this._http.patch<SubcontractingCost>(`${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/upsertCosts`, subcontractingCost)
    .toPromise()
    .then(
      (result) => {
        console.log('upsertSubcontractingCost: Success!', result);
        this._costService.getCosts(subcontractingCost.projectId, subcontractingCost.budgetId);
      },
      (error) => console.error('upsertSubcontractingCost: Error!', error)
    );
  }

  async deleteSubcontractingCost(subcontractingCost: SubcontractingCost) {
    console.log(`deleteSubcontractingCost ${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs/${subcontractingCost.costId}`);
    await this._http.delete<SubcontractingCost>(`${this.apiServer}/projects/${subcontractingCost.projectId}/budgets/${subcontractingCost.budgetId}/costs/${subcontractingCost.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteSubcontractingCost: Success!', result);
        this._costService.getCosts(subcontractingCost.projectId, subcontractingCost.budgetId);
      },
      (error) => console.error('deleteSubcontractingCost: Error!', error)
    );
  }

  private static subcontractingCostTemplate: SubcontractingCost = {
    projectId: null,
    budgetId: null,
    costId: null,
    costType: CostType.NonPeople,
    modifiedAt: null,
    modifiedBy: null,
    nonPeopleId: null,
    nonPeopleDescription: '',    // e.g. 'Domestic Travel'
    nonPeopleType: NonPeopleType.Subcontracting,       // Direct / Subcontracting / ContractForService
    costPeriods: [],
    costTotal: 0.0,
    institution: '',
  };

  public getInstance(budget: Budget): SubcontractingCost {
    let data: SubcontractingCost = cloneDeep(SubcontractingCostService.subcontractingCostTemplate);
    data.projectId = budget?.projectId;
    data.budgetId = budget?.budgetId;
    data.nonPeopleId = uuidv4();
    budget?.budgetPeriods?.forEach((period) => {
      data.costPeriods.push({
        key: data.nonPeopleId + '-' + period.startDate,
        value: 0.0,
      });
    });
    data.modifiedAt = Date.now();
    return data;
  }
}
