import { cloneDeep } from 'lodash';
import { Project } from './../entities/project';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DateUtil } from '../utils/dateUtil';
import { CurrentUser } from '../entities/user';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  public apiServer = environment.apiServer;
  public projects$ = new BehaviorSubject<Project[]>(null);
  public project$ = new Subject<Project>();

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {}

  async getProjects() {
    console.log(`getProject /projects`);
    this._http.get<Project[]>(`${this.apiServer}/projects`)
    .toPromise()
    .then(
      (result) => this.projects$.next(result),
      (_) => this.projects$.next(undefined)
    );
  }

  async setCurrentProject(project: Project){
    console.log("set current: " + project.projectId)
    this.project$.next(project)
  }

  async getProject(projectId: string) {
    console.log(`getProject /projects/${projectId}`);
    this._http.get<Project>(`${this.apiServer}/projects/${projectId}`)
    .toPromise()
    .then(
      (result) => this.project$.next(result[0]),
      (_) => this.project$.next(undefined)
    );
  }

  async addProject(project: Project) {
    let cleanProject = Object.assign({}, project);
    delete cleanProject.projectId
    console.log(`addProject ${this.apiServer}/projects`, cleanProject);
    await this._http.post<Project>(`${this.apiServer}/projects`, cleanProject)
    .toPromise()
    .then(
      (result) => {
        console.log('Post project: Success!', result);
        if (result?.projectId) {
          this._router.navigate(['projects', result?.projectId]); // /projects/3123123-123123121-1312312
        }
        this.getProjects();
      },
      (error) => console.error('Post project: Error!', error)
    );
  }

  async deleteProject(project: Project) {
    console.log(`deleteProject/project ${JSON.stringify(project)}`)
    const projectId = project.projectId;
    await this._http.delete<Project>(`${this.apiServer}/projects/${projectId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('Delete project: Success!', result);
        this.getProjects();
      },
      (error) => console.error('Delete project: Error!', error)
    );
  }

  async putProject(project: Project) {
    console.log(`updateProject ${this.apiServer}/projects/${project.projectId}`, project);
    await this._http.patch<Project>(`${this.apiServer}/projects/${project.projectId}`, project)
    .toPromise()
    .then(
      (result) => {
        console.log('Put project: Success!', result);
      },
      (error) => console.error('Put project: Error!', error)
    );
  }

  private static projectTemplate: Project = {
    projectId: '',
    projectCode: '',
    projectName: '',
    principalInvestigator: '',
    // faculty: this.user?.selectedTeam[0],
    faculty: '',
    // deptCode: FacultyConfig.getDeptCode(this.user?.selectedTeam[0]) ? FacultyConfig.getDeptCode(this.user?.selectedTeam[0]): 'Nil',
    deptCode: '',
    estimatedStartDate: DateUtil.tomorrow(), // keep toISOString() for ion-datetime
    period: 0,
    estimatedEndDate: '',
    // budgets: [],
    // modifiedAt: "1",
    pbrfCategory: '',
    pbrfSubCategory: '',
    // administrators: [],
    // editors: []
    projectRoles: null,
  };

  public getInstance(currentUser: CurrentUser, DEFAULT_PROJECT_PERIOD: number): Project {
    let data = cloneDeep(ProjectsService.projectTemplate);
    data.principalInvestigator = currentUser?.firstName + ' ' + currentUser?.lastName;
    data.period = DEFAULT_PROJECT_PERIOD;
    data.estimatedEndDate = DateUtil.nextYear(DateUtil.tomorrow(), DEFAULT_PROJECT_PERIOD); // keep toISOString() for ion-datetime
    return data;
  }  
}
