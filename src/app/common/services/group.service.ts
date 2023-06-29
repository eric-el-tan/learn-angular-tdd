import { cloneDeep } from 'lodash';
import { IdentityData } from './identity.data';
import {AccessProject, ProjectAccess} from '../entities/loginUser';
import { ProjectAccessData } from '../data/access.data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';
import { Identity } from '../entities/identity';
import { LoginAccess } from '../entities/loginUser';
import { ProjectsService } from './projects.service';
import { v4 as uuidv4 } from 'uuid';
import {Budget, Project} from '../entities/project';
import {filter, map, mergeAll, take, takeUntil, takeWhile, tap, toArray} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  public static readonly ACCESS_TYPE_PROJECT_ADMINISTRATOR = 'administrator';
  public static readonly ACCESS_TYPE_PROJECT_EDITOR = 'editor';
  public apiServer = environment.apiServer;
  public groups$ = new Subject<Identity[]>();
  public access: LoginAccess;
  public projectAccess$ = new Subject<ProjectAccess>();
  public projectAccesses$ = new Subject<ProjectAccess[]>();
  public projectAdminAccessIds$ = new Subject<string[]>();

  public newProjectAccesses$ = new BehaviorSubject<AccessProject[]>(null);
  public selectedProjectAccess$ = new BehaviorSubject<AccessProject[]>(null);


  constructor(private _http: HttpClient, private _projectsService: ProjectsService) { }

  getProjectAccess(projectId: string){
    console.log(`getProjectAccess ${this.apiServer}/projects/${projectId}/access`);
    this._http.get<AccessProject[]>(`${this.apiServer}/projects/${projectId}/access`)
        .pipe(take(1))
        .subscribe(
            (result) => {
              console.log('getProjectAccess: success!', result);
              this.newProjectAccesses$.next(result);
            },
            (_) => this.newProjectAccesses$.next(undefined)
        );
  }

  async addAccessProject(accessProject: AccessProject){
    console.log(`addAccessProject ${this.apiServer}/projects/${accessProject.projectId}/access`, accessProject);
    await this._http.post<AccessProject[]>(`${this.apiServer}/projects/${accessProject.projectId}/access`, accessProject)
      .toPromise()
      .then(
        (result) => {
          console.log('addAccessProject: success!', result);
          this.getProjectAccess(accessProject.projectId);
        }, 
        (error) => console.log('addAccessProject: error!', error)
        );
    }
    
  async updateAccessProject(accessProject: AccessProject){
    console.log(`updateAccessProject ${this.apiServer}/projects/${accessProject.projectId}/access`, accessProject);
    await this._http.patch(`${this.apiServer}/projects/${accessProject.projectId}/access`, accessProject)
      .toPromise()
      .then(
        (result) => {
          console.log('updateAccessProject: success!', result);
          this.getProjectAccess(accessProject.projectId);
        },
        (error) => console.log('addAccessProject: error!', error)
      );
  }

  async deleteAccessProject(accessProject: AccessProject) {
    const options = {
      body: {
        projectId: accessProject.projectId, 
        userId: accessProject.userId
      }
    };
    console.log(`deleteAccessProject ${this.apiServer}/projects/${accessProject.projectId}/access`, options);
    await this._http.delete<any>(`${this.apiServer}/projects/${accessProject.projectId}/access`, options )
      .toPromise()
      .then(
        (result) => {
          console.log('deleteAccessProject: success!', result);
          this.getProjectAccess(accessProject.projectId);
        },
        (error) => console.log('deleteAccessProject: error!', error)
      );
  }

  // Old (mock) methods

  getUserProjectRole(projectId: string, userId: string){
    // TODO return user role in current project
  }

  getProjectAdminIds(projectId: string){
    // TODO return all admins for the given project
  }

  private static add(data: ProjectAccess, results: ProjectAccess[]): ProjectAccess[] {
    results.push(data);
    return results;
  }

  deleteProjectAccess2(project: Project) {
    ProjectAccessData.projectAccesses = GroupService.removeProject(project.projectId, ProjectAccessData.projectAccesses);
  }

  private static removeProject(projectId: string, results: ProjectAccess[]): ProjectAccess[] {
    return results.filter(access => access.projectId !== projectId);
  }


  getProjectAdminAccessIds(): void {
    let projectIds: string[] = ProjectAccessData.projectAccesses.filter(access => access.accessType === GroupService.ACCESS_TYPE_PROJECT_ADMINISTRATOR).map(access => access.projectId);
    this.projectAdminAccessIds$.next(projectIds);
  }

  async getAllGroups() {
    const searchStr: string = 'null';
    console.log(`getAllGroups /groups/${searchStr}`);
    this._http.get<Identity[]>(`${this.apiServer}groups/${searchStr}`).toPromise().then(
      (results) => {
        this.groups$.next(results);
        console.log('Get all groups: Success!', results);
      },
      (error) => {
        console.error('Get all groups: Error!', error);
        this.groups$.next(undefined);
      }
    );
  }

  addAdministrator(projectId: string, name: any, isGroup: boolean = false) { // TODO: use addAccessProject instead
    
    let projectAccess: ProjectAccess = {
      accessId: '',
      projectId: '',
      accessType: '',
      userInfo: {
        empId: '',  // 160792387
        name: '', //Eric Tan
        email: '' //eric.tan@auckland.ac.nz
      },
    };
    
    projectAccess.accessId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    projectAccess.projectId = projectId;
    projectAccess.accessType = 'administrator';
    isGroup? 
    projectAccess.userInfo.name = 'name': 
    projectAccess.userInfo = IdentityData.identities.filter(i => i.nameDisplay === 'Eric Tan')[0];
    // projectAccess.userInfo = {empId: '160792387', name: 'Eric Tan', email: 'eric.tan@auckland.ac.nz'}    
    let existAlready: ProjectAccess[] = ProjectAccessData.projectAccesses.filter(i => i.userInfo.name === projectAccess.userInfo.name && i.projectId === projectAccess.projectId);
    if (existAlready.length === 0) {
      GroupService.add(projectAccess, ProjectAccessData.projectAccesses);
      console.log('addAdministrator: Success!', ProjectAccessData.projectAccesses.map(i => i));
    }
  }

  async addGroupAsAdministrator(projectId: string, groupName: any) {
    console.log(`addAdministrator /admin/${projectId}, ${JSON.stringify(groupName)}`);
    this._http.put<any>(`${this.apiServer}admin/${projectId}`, groupName).toPromise().then(
      (results) => {
        this._projectsService.getProject(projectId);
        console.log('Put admin: Success!', results);
      },
      (error) => {
        console.error('Put admin: Error!')
      }
    )
  }

  deleteAdministrator(projectId: string, empIdOrGroupName: string){
    console.log(`deleteAdministrator /admin/${projectId}/name/${empIdOrGroupName}`);
    
    this._http.delete<any>(`${this.apiServer}admin/${projectId}/name/${empIdOrGroupName}`).toPromise().then(
      (results) => {
        this._projectsService.getProject(projectId);
        console.log('Delete admin: Success!', results);
      },
      (error) => {
        console.error('Delete admin: Error!')
      }
    )
  }

  async addGroupAsEditor(projectId: string, groupName: any) {
    console.log(`addEditor /editor/${projectId}, ${JSON.stringify(groupName)}`);
    this._http.put<any>(`${this.apiServer}editor/${projectId}`, groupName).toPromise().then(
      (results) => {
        this._projectsService.getProject(projectId);
        console.log('Put editor: Success!', results);
      },
      (error) => {
        console.error('Put editor: Error!')
      }
    )
  }

  deleteEditor(projectId: string, groupName: string){
    console.log(`deleteEditor /editor/${projectId}/name/${groupName}`);
    
    this._http.delete<any>(`${this.apiServer}editor/${projectId}/name/${groupName}`).toPromise().then(
      (results) => {
        this._projectsService.getProject(projectId);
        console.log('Delete editor: Success!', results);
      },
      (error) => {
        console.error('Delete editor: Error!')
      }
    )
  }

  async setAccess() {
    // console.log(`setAccess step1: /access`);
    await this._http.get<LoginAccess>(`${this.apiServer}access`)
    .toPromise()
    .then(
      (result) => {
        // console.log('Get access: Success!', result);
        this.access = result;
      },
      (error) => {
        this.access = undefined;
        console.log('setAccess step1: Error!', error);
      }
    );

    // console.log(`getIdentitySimpleSearch /identitySimpleSearch/${searchStr}`);
    const empId = this.access.userInfo.empId;
    // console.log(`setAccess step2: /identitySimpleSearch/${empId}`);
    if (empId) {
      await this._http.get<Identity[]>(`${this.apiServer}identitySimpleSearch/${empId}`)
      .toPromise()
      .then(
        (results) => {
          if (results?.length > 0) {
            let loginUser: Identity = results[0]; // identity api should return only one record for empId should be exactly matched
            if (this.access?.userInfo && loginUser) {
              this.access.userInfo.staffUpi = loginUser.staffUpi;
            }
            // console.log('setAccess step2: Success!', this.access.userInfo);
          }
        },
        (error) => {
          console.error('setAccess step2: Identity Error!', this.access.userInfo);
        }
      );
    }
  }

  private static dataTemplate: AccessProject = {
    projectId: '',
    accessType: '',
    userId: '',
    name: ''
  };
  
  public getInstance(projectId: string): AccessProject {
    let data: AccessProject = cloneDeep(GroupService.dataTemplate);
    data.projectId = projectId;
    return data;
  }

  // private static dataTemplate2: ProjectAccess = {
  //   accessId: '',
  //   projectId: '',
  //   accessType: '',
  //   userInfo: {
  //     empId: '',
  //     name: '',
  //     email: '',
  //     firstName: '',
  //     lastName: '',
  //     staffUpi: ''
  //   },
  //   // ofGroups: [],
  // };

  // public getInstance2(projectId: string): ProjectAccess {
  //   let data: ProjectAccess = cloneDeep(GroupService.dataTemplate2);
  //   data.projectId = projectId;
  //   return data;
  // }
}