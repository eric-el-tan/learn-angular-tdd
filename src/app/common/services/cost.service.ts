import { DirectCost } from 'src/app/common/entities/nonPeople/directCost';
import { CasualStaff } from 'src/app/common/entities/people/casualStaff';
import { NamedStaff } from 'src/app/common/entities/people/staff';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Staff } from '../entities/people/staff';
import { Cost } from '../entities/cost/cost';
import { Student } from '../entities/people/student';
import { ContractForServiceCost } from '../entities/nonPeople/contractForServiceCost';
import { SubcontractingCost } from '../entities/nonPeople/subcontractingCost';

@Injectable({
  providedIn: 'root',
})
export class CostService {
  public apiServer = environment.apiServer;
  public namedStaffs$ = new BehaviorSubject<NamedStaff[]>(null);
  public unnamedStaffs$ = new BehaviorSubject<Staff[]>(null);
  public casualStaffs$ = new BehaviorSubject<CasualStaff[]>(null);
  public students$ = new BehaviorSubject<Student[]>(null);
  public directCosts$ = new BehaviorSubject<DirectCost[]>(null);
  public subcontractingCosts$ = new BehaviorSubject<SubcontractingCost[]>(null);
  public contractForServiceCosts$ = new BehaviorSubject<ContractForServiceCost[]>(null);
  public allCosts$ = new BehaviorSubject<Cost[]>(null);

  constructor(private _http: HttpClient) {}

  clearCosts(){
    this.namedStaffs$.next(null);
    this.casualStaffs$.next(null);
    this.unnamedStaffs$.next(null);
    this.students$.next(null);
    this.directCosts$.next(null);
    this.subcontractingCosts$.next(null);
    this.contractForServiceCosts$.next(null);
    this.allCosts$.next(null);
  }
  
  async addCost(cost: Cost) {
    console.log(`addCost ${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs`, cost);
    await this._http.post<Cost>(`${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs`, cost)
    .toPromise()
    .then(
      (result) => {
        console.log('create cost: success!', result);
        this.getCosts(cost.projectId, cost.budgetId);
      },
      (error) => console.error('create cost: error!', error)
    );
  }

  addDirectCostLocally(cost: Cost[]) {
    this.directCosts$.next(cost as DirectCost[]);
  }

  addContractForServiceCostLocally(cost: ContractForServiceCost[]) {
    this.contractForServiceCosts$.next(cost as ContractForServiceCost[]);
  }

  addSubcontractingCostLocally(cost: SubcontractingCost[]) {
    this.subcontractingCosts$.next(cost as SubcontractingCost[]);
  }

  async updateCost(cost: Cost) {
    console.log(`updateCost ${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`, cost);
    await this._http.patch<Cost>(`${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`, cost)
    .toPromise()
    .then(
      (result) => {
        console.log('updateCost: Success!', result);
        this.getCosts(cost.projectId, cost.budgetId);
      },
      (error) => console.error('updateCost: Error!', error)
    );
  }

  updateCostPromise(cost: Cost): Promise<Cost> {
    console.log(`updateCostPromise ${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`, cost);
    return this._http.patch<Cost>(`${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`, cost)
    .toPromise();
  }

  async deleteCost(cost: Cost) {
    console.log(`deleteCost ${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`);
    this._http.delete<Cost>(`${this.apiServer}/projects/${cost.projectId}/budgets/${cost.budgetId}/costs/${cost.costId}`)
    .subscribe(
      (result) => {
        console.log('deleteCost: Success!', result);
        this.getCosts(cost.projectId, cost.budgetId);
      },
      (error) => console.error('deleteCost: Error!', error)
    );
  }

  async getCosts(projectId: string, budgetId: string) {
    console.log(`getCosts ${this.apiServer}/projects/${projectId}/budgets/${budgetId}/costs`);
    this._http.get<Cost>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}/costs`)
    .toPromise()
    .then(
      (result) => {
        console.log(`result: `, result);
        this.namedStaffs$.next(Array.from(result['namedStaffs'], i => i as NamedStaff));
        this.unnamedStaffs$.next(Array.from(result['unNamedStaffs'], i => i as Staff));
        this.casualStaffs$.next(Array.from(result['casualStaff'], i => i as CasualStaff));
        this.students$.next(Array.from(result['students'], i => i as Student));
        this.directCosts$.next(Array.from(result['directCosts'], i => i as DirectCost));
        this.subcontractingCosts$.next(Array.from(result['subcontractingCosts'], i => i as SubcontractingCost));
        this.contractForServiceCosts$.next(Array.from(result['contractForServiceCosts'], i => i as ContractForServiceCost));
        this.allCosts$.next([
          ...Array.from(result['namedStaffs'], i => i as Cost),
          ...Array.from(result['unNamedStaffs'], i => i as Cost),
          ...Array.from(result['casualStaff'], i => i as Cost),
          ...Array.from(result['students'], i => i as Cost),
          ...Array.from(result['directCosts'], i => i as Cost),
          ...Array.from(result['subcontractingCosts'], i => i as Cost),
          ...Array.from(result['contractForServiceCosts'], i => i as Cost),
        ]);
      },
      (_) => this.unnamedStaffs$.next(undefined)
    );
  }

  getCostsPromise(projectId: string, budgetId: string): Promise<Cost[]> {
    console.log(`getCostsPromise ${this.apiServer}/projects/${projectId}/budgets/${budgetId}/costs`);
    return this._http.get<Cost[]>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}/costs`).toPromise();
  }
}
