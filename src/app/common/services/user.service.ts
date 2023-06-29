import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {properties} from '../../../environments/environment';
import {CurrentUser, User} from "../entities/user";
import {LoginService} from "@uoa/auth";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public apiServer = environment.apiServer;
  static static_user: User = {
    empId: '241555949',
    emplId: '241555949',
    name: 'Eric Tan',
    email: 'eric.tan@auckland.ac.nz',
    staffUpi: 'etan221',
    firstName: 'Eric',
    lastName: 'Tan',
    firstTeams: ['Science', 'Engineering','Auckland Bioengineering Institute','Education and Social Work'],
    selectedTeam: ['Auckland Bioengineering Institute'],
    authorizedApps: [],
    isAdmin: true,
    isTestMode: true,
  };

  private user: User = {
    empId: '241555949',
    emplId: '241555949',
    name: 'Eric Tan',
    email: 'eric.tan@auckland.ac.nz',
    staffUpi: 'etan221',
    firstName: 'Eric',
    lastName: 'Tan',
    firstTeams: ['Science', 'Engineering','Auckland Bioengineering Institute','Education and Social Work'],
    selectedTeam: ['Auckland Bioengineering Institute'],
    authorizedApps: [],
    isAdmin: true,
    isTestMode: true,
  };

  private user$: BehaviorSubject<User>;
  public currentUser$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  constructor(private _http: HttpClient, private loginService: LoginService) {
      this.user$ = new BehaviorSubject<User>(undefined);
      this.loginService.loggedIn$.subscribe(loggedIn =>{
        if(loggedIn){
          this.resolveUser();
        }
      })
  }

  private resolveUser(){
    this.user$.next(this.user);
    // this.http.get<User>(`${properties.apiServer}/user`).toPromise().then(
    //   (response) => {
    //     console.log(`calling ${properties.apiServer}/user`, response);
    //     this.user = response;
    //     this.user.empId = this.user.emplId;
    //     this.user.firstTeams = ['Science111', 'Engineering','Auckland Bioengineering Institute','Education and Social Work'];
    //     this.user.selectedTeam = ['Auckland Bioengineering Institute'];
    //     // this.user.selectedTeam = this.user?.firstTeams[0];
    //     this.user.authorizedApps = [];
    //     this.user.isAdmin = true;
    //     this.user.isTestMode = true;
    //     this.user$.next(this.user);
    //   },
    //   (_) => this.user$.error('Unable to resolve user')
    // );
  }

  async getCurrentUser2() {
    this._http.get<CurrentUser>(`${this.apiServer}/currentUser`).toPromise().then(
      (result) => {
        result.isAdmin = (result.isResearchAdmin || result.isToolAdmin);
        this.currentUser$.next(result);
        console.log('get current user: Success!', result);
      },
      (error) => {
        this.currentUser$.next(undefined);
        console.error('get current user: Error!', error);
      }
    );
  }

  getCurrentUser(): Observable<User>{
      return this.user$.asObservable();
  }

  isAuthorized(actionFor: string, enableCallback: any){
      this.user$.subscribe(user => {
          if(user?.authorizedApps?.includes(actionFor) || user?.isAdmin){
              enableCallback.apply();
          }
      })
  }

  toggleAdminMode(){
      this.user.isTestMode = !this.user.isTestMode
      this.user$.next(this.user);
  }

  logout() {
      this.loginService.logout();
  }

}
