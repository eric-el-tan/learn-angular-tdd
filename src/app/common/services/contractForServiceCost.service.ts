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
import { ContractForServiceCost } from '../entities/nonPeople/contractForServiceCost';

@Injectable({
  providedIn: 'root',
})
export class ContractForServiceCostService {
  public apiServer = environment.apiServer;
  public directCosts: ContractForServiceCost[] = [];
  public directCost$ = new BehaviorSubject<ContractForServiceCost>(null);
  public unsavedDirectCost$ = new BehaviorSubject<ContractForServiceCost>(null);

  constructor(private _http: HttpClient, private _costService: CostService) {}

  public directCosts$ = new BehaviorSubject<ContractForServiceCost[]>(null);

  async addDirectCostLocally(directCost: ContractForServiceCost) {
    this.directCosts.push(directCost);
    this.directCosts$.next(this.directCosts);
  }

  async addDirectCost(directCost: ContractForServiceCost) {
    console.log(`addDirectCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs`);
    await this._http.post<ContractForServiceCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('create directCost: success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('create directCost: error!', error)
    );
  }

  async updateDirectCost(directCost: ContractForServiceCost) {
    console.log(`updateDirectCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`);
    await this._http.patch<ContractForServiceCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('updateDirectCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('updateDirectCost: Error!', error)
    );
  }

  async upsertContractForServiceCost(directCost: ContractForServiceCost) {
    console.log(`upsertContractForServiceCost ${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/upsertCosts`);
    await this._http.patch<ContractForServiceCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/upsertCosts`, directCost)
    .toPromise()
    .then(
      (result) => {
        console.log('ContractForServiceCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('ContractForServiceCost: Error!', error)
    );
  }

  async deleteDirectCost(directCost: ContractForServiceCost) {
    console.log(`deleteDirectCost /projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`);
    await this._http.delete<ContractForServiceCost>(`${this.apiServer}/projects/${directCost.projectId}/budgets/${directCost.budgetId}/costs/${directCost.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('deleteDirectCost: Success!', result);
        this._costService.getCosts(directCost.projectId, directCost.budgetId);
      },
      (error) => console.error('deleteDirectCost: Error!', error)
    );
  }

  private static contractForServiceCostTemplate: ContractForServiceCost = {
    projectId: null,
    budgetId: null,
    costId: null,
    costType: CostType.NonPeople,
    modifiedAt: null,
    modifiedBy: null,
    nonPeopleId: null,
    nonPeopleDescription: '',    // e.g. 'Domestic Travel'
    nonPeopleType: NonPeopleType.ContractForService,       // Direct / Subcontracting / ContractForService
    costPeriods: [],
    costTotal: 0.0,
    institution: '',
  };

  public getInstance(budget: Budget): ContractForServiceCost {
    let data: ContractForServiceCost = cloneDeep(ContractForServiceCostService.contractForServiceCostTemplate);
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
