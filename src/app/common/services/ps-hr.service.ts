import {Injectable} from '@angular/core';
import {PsHrQuery} from "../entities/ps-hr-query";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NamePsStaff, PsStaff, StandardWage} from "../entities/psStaff";
import {map, retry, take} from "rxjs/operators";
import {BypassErrorService} from "@uoa/error-pages";
import {StaffType} from "../entities/people/staff";

@Injectable({
  providedIn: 'root'
})
export class PsHrService {
  public apiServer = environment.apiServer;
  public contractResponse$ = new BehaviorSubject<PsStaff[]>(null);
  public peoplePickerResponse$ = new BehaviorSubject<PsStaff[]>(null);
  constructor(private _http: HttpClient,
              private _bypass : BypassErrorService) { }

  static parseQuery(params:PsHrQuery):string{
    return '?' + Object.entries(params)
        .map(([key, value])=> `${key}=${value}`)
        .join('&');
  }

  searchContract(params:PsHrQuery) {
    const queryString = PsHrService.parseQuery(params);
    this._bypass.bypassError(`${this.apiServer}/psft/salaries/contracts${queryString}`, [502, 404, 400, 500]);
    console.log(`${this.apiServer}/psft/salaries/contracts${queryString}`);
    this._http.get<PsStaff[]>(`${this.apiServer}/psft/salaries/contracts${queryString}`)
        .pipe(retry(3))
        .pipe(map((psHrResponse: PsStaff[]) => {
          console.log(`searchNameContract - psHrResponse2: `, psHrResponse);
          return psHrResponse;
        }))
        .subscribe(
          (response)=> {
            console.log(`searchNameContract - searchPeopleUpi2: `, response);
            this.contractResponse$.next(response);
          }, 
          error => { console.log(error);}
        );
  }

  searchPeople(params:PsHrQuery) {
    const queryString = PsHrService.parseQuery(params);
    this._bypass.bypassError(`${this.apiServer}/psft/salaries/contracts${queryString}`, [502, 404, 400, 500])
    console.log(`${this.apiServer}/psft/salaries/contracts${queryString}`);
    this._http.get<PsStaff[]>(`${this.apiServer}/psft/salaries/contracts${queryString}`)
        .pipe(retry(3),
          take(1),
          map((psHrResponse: PsStaff[]) => {
            console.log(`psHrResponse2: `, psHrResponse);
            return psHrResponse;
          }))
        .subscribe(
          (response)=> {
            console.log(`searchPeopleUpi2: `, response);
            this.peoplePickerResponse$.next(response);
          }, 
          error => {
            console.log(error);
          })
  }

  getWage(upi:string, projectId:string, params:PsHrQuery): Observable<PsStaff[]> {
    const queryString = PsHrService.parseQuery(params);
    const projectIdHead = {
      'x-projectid': projectId
    };
    console.log(`${this.apiServer}/psft/salaries/wage/${upi}${queryString}`, {headers: projectIdHead});
    this._bypass.bypassError(`${this.apiServer}/psft/salaries/wage/${upi}${queryString}`, [502, 404, 400, 500]);
    return this._http.get<PsStaff[]>(`${this.apiServer}/psft/salaries/wage/${upi}${queryString}`, {headers: projectIdHead})
  }

}
