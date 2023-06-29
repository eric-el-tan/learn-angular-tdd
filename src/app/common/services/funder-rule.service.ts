import { cloneDeep } from 'lodash';
import { IdentityData } from './identity.data';
import { ProjectAccess } from '../entities/loginUser';
import { ProjectAccessData } from '../data/access.data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunderRule } from '../entities/funder-rule';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunderRuleService { // rename to AccessService

  public apiServer = environment.apiServer;
  public funderRule$ = new Subject<FunderRule>();
  public funderRules$ = new Subject<FunderRule[]>();
  static NO_LIMIT: number = 99999999.0;
  static DEFAULT_FTE: number = 0.03;

  constructor(
    private _http: HttpClient
  ) { }

  async getFunderRule(funderRuleId: string){
    console.log(`getFunderRule ${this.apiServer}/rules/${funderRuleId}`);
    await this._http.get<FunderRule>(`${this.apiServer}/rules/${funderRuleId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('Get a funderRule: Success!', result);
        this.funderRule$.next(result);
      },
      (error) => console.error(`Get a funderRule`, error)
    )
    this.getFunderRules();
  }
  
  async deleteFunderRule(funderRule: FunderRule) {
    const ruleId = funderRule.ruleId;
    console.log(`deleteFunderRule ${this.apiServer}/rules/${ruleId}`);
    await this._http.delete<FunderRule>(`${this.apiServer}/rules/${ruleId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('Delete project: Success!', result);
        this.getFunderRules();
      },
      (error) => console.error('Delete project: Error!', error)
    );
  }

  async addFunderRule(funderRule: FunderRule){
    funderRule = FunderRuleService.assignId(funderRule);
    console.log(`addFunderRule ${this.apiServer}/rules`, funderRule);
    await this._http.post<FunderRule>(`${this.apiServer}/rules`, funderRule)
    .toPromise()
    .then(
      (result) => {
        console.log('Create funderRule: Success!', result);
        this.getFunderRules();
      },
      (error) => console.error('Create funderRule: Error!', error)
    )
  }

  async updateFunderRule(ruleId: string, funderRule: FunderRule) {
    console.log(`updateFunderRule ${this.apiServer}/rules/${ruleId}`, funderRule);
    await this._http.patch<FunderRule>(`${this.apiServer}/rules/${ruleId}`, funderRule)
    .toPromise()
    .then(
      (result) => {
        console.log('Update funderRule: Success!', result);
        this.getFunderRules();
      },
      (error) => console.error('Update funderRule: Error!', error)
    );
  }

  private static assignId(funderRule: FunderRule): FunderRule {
    funderRule.ruleId = Date.now().toString();
    return funderRule;
  }

  private static remove(ruleId: string, results: FunderRule[]): FunderRule[] {
    return results.filter(rule => rule.ruleId !== ruleId);
  }

  private static add(data: FunderRule, results: FunderRule[]): FunderRule[] {
    results.push(data);
    return results;
  }

  async getFunderRules(){
    console.log(`getFunderRules ${this.apiServer}/rules`);
    this._http.get<FunderRule[]>(`${this.apiServer}/rules`)
    .toPromise()
    .then(
      (result) => this.funderRules$.next(result),
      (_) => this.funderRules$.next(undefined)
    );
  }

  // addAdministrator(projectId: string, name: any, isGroup: boolean = false) {
    
  //   let projectAccess: ProjectAccess = {
  //     accessId: '',
  //     projectId: '',
  //     accessType: '',
  //     userInfo: {
  //       empId: '',  // 160792387
  //       name: '', //Eric Tan
  //       email: '' //eric.tan@auckland.ac.nz
  //     },
  //   };
    
  //   projectAccess.accessId = Date.now().toString();
  //   projectAccess.projectId = projectId;
  //   projectAccess.accessType = 'administrator';
  //   isGroup? 
  //     projectAccess.userInfo.name = name: 
  //     projectAccess.userInfo = IdentityData.identities.filter(i => i.nameDisplay === name).pop();

  //   // GroupService.add(projectAccess, ProjectAccessData.projectAccesses);
  //   console.log('addAdministrator: Success!', ProjectAccessData.projectAccesses.map(i => i));
  // }

  private static dataTemplate: FunderRule = {
    ruleId: '',
    ruleName: '',
    funderName: '',
    fund: '',
    fundingRoundName: '',
    isActive: false,
    // general2
    totalFundingAmt: FunderRuleService.NO_LIMIT,
    period: 3, // 1,3,5 yrs
    effectiveStartDate: '',
    pbrfCategory: '',
    pbrfSubCategory: '',
    // staff
    maxSalaryChangePct: 4.5,
    overheadPct: 115.0,
    accPct: 0.16,
    superannuationPct: 6.75,
    fteList: [
      { roleName: 'Principal Investigator', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Associate Investigator', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Investigator', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Post-Doctoral Fellow', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Research Assistant', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Technical Assistant', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
      { roleName: 'Other Staff', maxSalary: FunderRuleService.NO_LIMIT, maxOverhead: FunderRuleService.NO_LIMIT},
    ],
    // student
    phdStipendAnnualLimit: 33000, // Value (Each Year)
    phdStipendAnnualIncreasePct: 4.5,
    phdTuitionAnnualLimit: 7659.6, // Value (Each Year)
    phdTuitionAnnualIncreasePct: 2.75,
    mastersStipendAnnualLimit: 13655, // Value (Each Year)
    mastersStipendAnnualIncreasePct: 4.5,
    mastersTuitionAnnualLimit: FunderRuleService.NO_LIMIT, // Value (Each Year)
    mastersTuitionAnnualIncreasePct: 2.75,
    includeServiceFee: true,
    servicesFeeAnnualIncreasePct: 2.0,
    allowInternational: true, 
    insuranceAnnualIncreasePct: 2.0,

    // direct cost
    directCostAnnualLimit: FunderRuleService.NO_LIMIT, // Value (Each Year)
  };

  public getInstance(): FunderRule {
    return cloneDeep(FunderRuleService.dataTemplate);
  }
}