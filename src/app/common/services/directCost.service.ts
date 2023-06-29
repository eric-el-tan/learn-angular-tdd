import { GlCodeConfig } from './../configs/glcode-config';
import { Budget } from 'src/app/common/entities/project';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../entities/project';
import { CostType } from '../entities/cost/cost';
import { CostService } from './cost.service';
import { DirectCost } from '../entities/nonPeople/directCost';
import { NonPeopleType } from '../entities/nonPeople/nonPeople';
import { multicast } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DirectCostService {
  public apiServer = environment.apiServer;
  public localDirectCosts: DirectCost[] = [];
  public localDirectCosts$ = new BehaviorSubject<DirectCost[]>(null);

  constructor(private _http: HttpClient, private _costService: CostService) {}


  async addDirectCostLocally(directCost: DirectCost) {
    this.localDirectCosts.push(directCost);
    this.localDirectCosts$.next(this.localDirectCosts);
  }

  async addDirectCost(directCost: DirectCost) {
    console.log(`addDirectCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs`, directCost);
    await this._http.post<DirectCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('create directCost: success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('create directCost: error!', error)
    );
  }

  async updateDirectCost(directCost: DirectCost) {
    console.log(`updateDirectCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`, directCost);
    await this._http.patch<DirectCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('updateDirectCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('updateDirectCost: Error!', error)
    );
  }

  async upsertDirectCost(directCost: DirectCost) {
    console.log(`upsertDirectCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/upsertCosts`, directCost);
    await this._http.patch<DirectCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/upsertCosts`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('upsertDirectCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('upsertDirectCost: Error!', error)
    );
  }

  async deleteDirectCost(directCost: DirectCost) {
    console.log(`deleteDirectCost /projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`);
    await this._http.delete<DirectCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteDirectCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('deleteDirectCost: Error!', error)
    );
  }

  private static directCostTemplate: DirectCost = {
    projectId: null,
    budgetId: null,
    costId: null,
    costType: CostType.NonPeople,
    modifiedAt: null,
    modifiedBy: null,
    nonPeopleId: null,
    nonPeopleDescription: '',    // e.g. 'Domestic Travel', short description
    nonPeopleType: NonPeopleType.Direct,       // Direct / Subcontracting / ContractForService
    costPeriods: [],
    costTotal: 0.0,
    directCostCategory: '',   // Equipment/Travel and Accommodation
    directCostExpenditureType: GlCodeConfig.OPEX,       // CAPEX or OPEX
    directCostDescription: '',        // comment, long description
  };

  public getInstance(budget: Budget): DirectCost {
    let data: DirectCost = cloneDeep(DirectCostService.directCostTemplate);
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
