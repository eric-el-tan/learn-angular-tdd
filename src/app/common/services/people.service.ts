
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectsService } from './projects.service';
import { BehaviorSubject } from 'rxjs';
import { PeopleData } from '../data/people.data';
import { Project } from '../entities/project';
import { NamedStaff, SalaryType, Staff } from '../entities/people/staff';

import { CostType } from '../entities/cost/cost';
import { PeopleType } from '../entities/people/peopleCost';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  public apiServer = environment.apiServer;
  public namedStaff$ = new BehaviorSubject<NamedStaff>(null);
  public unsavedNamedStaff$ = new BehaviorSubject<NamedStaff>(null);

  constructor(private _http: HttpClient, private _projectsService: ProjectsService) {}

  public namedStaffs$ = new BehaviorSubject<NamedStaff[]>(null);

  async addPeople(namedStaff: NamedStaff) {
    console.log(`addPeople /project/${namedStaff.projectId}/budget/${namedStaff.budgetId}`, namedStaff);
    await this._http.post<any>(`${this.apiServer}project/${namedStaff.projectId}/budget/${namedStaff.budgetId}`, namedStaff)
    .toPromise()
    .then(
      (result) => {
        this.namedStaff$.next(result);
        console.log('Add people: Success!', this.namedStaff$);
        this._projectsService.getProject(namedStaff.projectId);
      },
      (error) => {
        console.error('Add people: Error!', error);
        this.namedStaff$.next(undefined);
      }
    );
  }
  
  async addStudent(unnamedStudent: NamedStaff) {
    console.log(`addStudent /project/${unnamedStudent.projectId}/budget/${unnamedStudent.budgetId}`, unnamedStudent);
    await this._http.post<any>(`${this.apiServer}project/${unnamedStudent.projectId}/budget/${unnamedStudent.budgetId}`, unnamedStudent)
    .toPromise()
    .then(
      (result) => {
        this.namedStaff$.next(result);
        console.log('Add student: Success!', this.namedStaff$);
        this._projectsService.getProject(unnamedStudent.projectId);
      },
      (error) => {
        console.error('Add student: Error!', error);
        this.namedStaff$.next(undefined);
      }
    );
  }

  async updatePeoplePeriods(namedStaff: NamedStaff) {
    console.log(`updatePeoplePeriods2 /project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people/${namedStaff.peopleId}`, namedStaff);
    await this._http
      .put<any>(
        `${this.apiServer}project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people/${namedStaff.peopleId}`,
        namedStaff
      )
      .toPromise()
      .then(
        (result) => {
          this.namedStaff$.next(result);
          console.log('updatePeoplePeriods2: Success!', this.namedStaff$);
          this._projectsService.getProject(namedStaff.projectId);
        },
        (error) => {
          console.error('updatePeoplePeriods2: Error!', error);
          this.namedStaff$.next(undefined);
        }
      );
  }

  async updatePeopleDetail(namedStaff: NamedStaff) {
    console.log(
      `updatePeopleDetail /project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people2/${namedStaff.peopleId}`, namedStaff);
    this._http
      .put<any>(`${this.apiServer}project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people2/${namedStaff.peopleId}`, namedStaff)
      .toPromise()
      .then(
        (result) => {
          this.namedStaff$.next(result);
          console.log('updatePeopleDetail: Success!', this.namedStaff$);
          this._projectsService.getProject(namedStaff.projectId);
        },
        (error) => {
          console.error('updatePeopleDetail: Error!', error);
          this.namedStaff$.next(undefined);
        }
      );
  }
  
  async updateStudentDetail(unnamedStudent: NamedStaff) {
    console.log(
      `updateStudentDetail /project/${unnamedStudent.projectId}/budget/${unnamedStudent.budgetId}/people2/${unnamedStudent.peopleId}`, unnamedStudent);
    await this._http
      .put<any>(`${this.apiServer}project/${unnamedStudent.projectId}/budget/${unnamedStudent.budgetId}/people2/${unnamedStudent.peopleId}`, unnamedStudent)
      .toPromise()
      .then(
        (result) => {
          this.namedStaff$.next(result);
          console.log('updateStudentDetail: Success!', this.namedStaff$);
          this._projectsService.getProject(unnamedStudent.projectId);
        },
        (error) => {
          console.error('updateStudentDetail: Error!', error);
          this.namedStaff$.next(undefined);
        }
      );
  }

  deletePeople(namedStaff: NamedStaff) {
    console.log(`deletePeople /project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people/${namedStaff.peopleId}`);
    this._http
      .delete<any>(`${this.apiServer}project/${namedStaff.projectId}/budget/${namedStaff.budgetId}/people/${namedStaff.peopleId}`)
      .subscribe(
        (result) => {
          console.log('Delete people: Success!', result);
          this._projectsService.getProject(namedStaff.projectId);
        },
        (error) => console.error('Delete people: Error!', error)
      );
  }

  addNamedStaff(namedStaff: NamedStaff) {
    namedStaff.peopleId = Date.now().toString();
    console.log(`namedStaff: `, namedStaff);
    PeopleData.namedStaffs = PeopleService.add(namedStaff, PeopleData.namedStaffs);
    this.namedStaffs$.next(PeopleData.namedStaffs);
  }

  updateNamedStaff(data: NamedStaff) {
    PeopleData.namedStaffs = PeopleService.remove(data, PeopleData.namedStaffs);
    PeopleData.namedStaffs = PeopleService.add(data, PeopleData.namedStaffs);
  }

  private static add(data: NamedStaff, results: NamedStaff[]): NamedStaff[] {
    results.push(data);
    return results;
  }

  getNamedStaffs(budgetId: string) {
    let namedStaffs: NamedStaff[] = PeopleData.namedStaffs.filter(namedStaff => namedStaff.budgetId === budgetId);
    this.namedStaffs$.next(namedStaffs);
  }

  removeNamedStaff(namedStaff: NamedStaff) {
    let budgetId = namedStaff.budgetId;
    PeopleData.namedStaffs = PeopleService.remove(namedStaff, PeopleData.namedStaffs);
    this.getNamedStaffs(budgetId);
  }

  private static remove(namedStaff: NamedStaff, results: NamedStaff[]): NamedStaff[] {
    return results.filter(item => item.peopleId !== namedStaff.peopleId);
  }

  private static namedStaffTemplate: NamedStaff = {
    costId: null,
    costType: CostType.People,
    peopleId: null,
    nameDisplay: 'Unnamed staff 1',
    titleDisplay: '',
    peopleType: PeopleType.Unnamed,
    staffType: null,
    projectRole: 'Investigator',
    commitments: [],
    glcode: 'GL01',
    projectId: null,
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
      lastPromotionDate: '2021-01-01',
      expiryDate: '2099-12-31',
      salaryType: SalaryType.Standardised,
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
  };


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
      allowances: [
      ],
      lastPromotionDate: '2021-01-01',
      expiryDate: '2099-12-31',
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

  public getInstance(project: Project): NamedStaff {
    let data: NamedStaff = cloneDeep(PeopleService.unnamedStaffTemplate);
    data.projectId = project?.projectId;
    data.modifiedAt = Date.now();
    return data;
  }
}
