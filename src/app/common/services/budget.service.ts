import {BehaviorSubject, Subject} from 'rxjs';
import { Budget} from './../entities/project';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, take, withLatestFrom} from "rxjs/operators";
import {BudgetEditRequest, BudgetRequest} from "../../project/edit-budget/budget-request";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  public apiServer = environment.apiServer;
  public budgets$ = new BehaviorSubject<Budget[]>(null);
  public budget$ = new Subject<Budget>();
  public projectDataFlag$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _http: HttpClient, 
    private _router: Router,
  ) {}

  setProjectDataFlag(projectDataFlag: boolean){
    this.projectDataFlag$.next(projectDataFlag);
  }

  async getBudgets(projectId: string){
    console.log(`getBudgets ${this.apiServer}/projects/${projectId}/budgets`);
    await this._http.get<Budget[]>(`${this.apiServer}/projects/${projectId}/budgets`)
        .pipe(take(1))
        .subscribe(
            (result) => this.budgets$.next(result),
            (_) => this.budgets$.next(undefined)
        );
  }

  async getBudget(projectId: string, budgetId: string) {
    console.log(`getBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}`);
    await this._http.get<Budget>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}`)
    .toPromise()
    .then(
      (result) => {
        console.log(`getBudget: Success!`, result[0]);
        this.budget$.next(result[0]);
      },
      (error) => console.error(`getBudget: Error!`, error)
    );
  }

  async copyBudget(projectId: string, budgetId:string, newBudgetName: string) {
    console.log(`copyBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}/copy`, JSON.stringify(newBudgetName));
    await this._http.patch<string>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}/copy`, JSON.stringify(newBudgetName))
    .toPromise()
    .then(
      (newBudgetId) => {
        console.log('copyBudget: Success!', newBudgetId);
        this.getBudgets(projectId);
      },
      (error) => console.error('copyBudget: Error!', error)
    );
  }

  async createBudget(projectId: string, budget: BudgetRequest | BudgetEditRequest) {
    delete budget.locked;
    console.log(`createBudget ${this.apiServer}/projects/${projectId}/budgets`, budget);
    await this._http.post<any>(`${this.apiServer}/projects/${projectId}/budgets`, budget)
    .toPromise()
    .then(
      (result) => {
        console.log(`createBudget: Success!`, result);
        this.unlockBudget(projectId, result.budgetId, false);
        if (result?.budgetId) {
          this._router.navigate(['/projects/' + projectId + '/budgets/' + result?.budgetId]); // /projects/e97bb259-3195-412a-83c1-03f2ff5bd6cc/budgets/5cd26a3e-1a91-43e6-9632-1b021cd16669
        }
        this.getBudgets(projectId);
      },
      (error) => console.error('createBudget: Error!', error)
    );
  }

  async checkBudgetStatus(projectId: string, budgetId: string, budget: BudgetEditRequest){
    if(budget.budgetStatus?.toLowerCase().includes('final')){
      this.lockBudget(projectId, budgetId, true);
    }
    else if(budget.budgetStatus == 'locked'){
      this.unlockBudget(projectId, budgetId, false);
    }
  }

  async updateBudget(projectId: string, budgetId:string, budget: BudgetEditRequest) {
    delete budget.locked;
    console.log(`updateBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}`, budget);
    this._http.patch<any>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}`, budget)
    .toPromise()
    .then(
      (result) => {
        console.log("updateBudget: Success!", result);
        this.checkBudgetStatus(projectId, budgetId, budget)
      },
      (error) => console.error('updateBudget: Error!', error)
    );
  }

  async updateThenRefreshBudgets(projectId: string, budgetId:string, budget: BudgetEditRequest) {
    delete budget.locked;
    console.log(`updateBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}`, budget);
    this._http.patch<any>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}`, budget)
    .toPromise()
    .then(
      (result) => {
        console.log("updateThenRefreshBudget: Success!", result);
        this.checkBudgetStatus(projectId, budgetId, budget);
        this.getBudgets(projectId);
      },
      (error) => console.error('updateBudget: Error!', error)
    );
  }

  async deleteBudget(projectId: string, budgetId:string) {
    console.log(`deleteBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}`);
    this._http.delete<any>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}`)
    .toPromise()
    .then(
      (result) => {
        console.error('deleteBudget: Success!', result);
        this.getBudgets(projectId);
      },
      (error) => console.error('deleteBudget: Error!', error)
    );
  }

  async lockBudget(projectId: string, budgetId:string, islocked: boolean) {
    console.log(`lockBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}/lock`, islocked);
    this._http.patch<any>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}/lock`, islocked)
    .toPromise()
    .then(
      (result) => {
        console.log("lockBudget: Success!", result);
        this.getBudgets(projectId);
      },
      (error) => console.error('lockBudget: Error!', error)
    );
  }

  async unlockBudget(projectId: string, budgetId:string, islocked: boolean) {
    console.log(`unlockBudget ${this.apiServer}/projects/${projectId}/budgets/${budgetId}/unlock`, islocked);
    this._http.patch<any>(`${this.apiServer}/projects/${projectId}/budgets/${budgetId}/unlock`, islocked)
    .toPromise()
    .then(
      (result) => {
        console.log("unlockBudget: Success!", result);
        this.getBudgets(projectId);
      },
      (error) => console.error('unlockBudget: Error!', error)
    );
  }
}