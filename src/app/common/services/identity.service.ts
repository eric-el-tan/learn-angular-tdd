import { IdentityData } from './identity.data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Identity } from '../entities/identity';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  public apiServer = environment.apiServer;
  public upis$ = new Subject<Identity[]>();

  constructor(private _http: HttpClient) { }

  async getIdentity(searchStr: string) {
    // console.log(`getIdentity /identity1/${searchStr}`);
    this._http.get<Identity[]>(`${this.apiServer}/identity1/${searchStr}`).toPromise().then(
    // this._http.get<NamedStaff>(`${this.apiServer}salary/${namedStaff.staffUpi}`).subscribe(
      (result) => {
        this.upis$.next(result);
        // console.log('Get identity: Success!', result);
      },
      (error) => {
        console.error('Get identity: Error!', error);
        this.upis$.next(undefined);
      }
    );
  }
  
  async getIdentityWithLastName(firstName: string, lastName: string) {
    // console.log(`getIdentity /identity2/firstName/${firstName}/lastName/${lastName}`);
    this._http.get<Identity[]>(`${this.apiServer}/identity2/firstName/${firstName}/lastName/${lastName}`)
    .toPromise()
    .then(
      (result) => {
        this.upis$.next(result);
        // console.log('Get identity: Success!', result);
      },
      (error) => {
        console.error('Get identity: Error!', error);
        this.upis$.next(undefined);
      }
      );
    }

    async getIdentityUPI(inUpi: string) {
      // console.log(`getIdentityUPI /identityUpi/${inUpi}`);
      this._http.get<Identity[]>(`${this.apiServer}/identityUpi/${inUpi}`).toPromise().then(
        (result) => {
          this.upis$.next(result);
          // console.log('Get getIdentityUPI: Success!', result);
        },
        (error) => {
          console.error('Get getIdentityUPI: Error!', error);
          this.upis$.next(undefined);
        }
      );
    }

  async getIdentitySimpleSearch(searchStr: string) {
    // console.log(`getIdentitySimpleSearch /identitySimpleSearch/${searchStr}`);
    this._http.get<Identity[]>(`${this.apiServer}/identitySimpleSearch/${searchStr}`).toPromise().then(
        (result) => {
          this.upis$.next(result);
          // console.log('Get getIdentitySimpleSearch: Success!', result);
        },
        (error) => {
          console.error('Get getIdentitySimpleSearch: Error!', error);
          this.upis$.next(undefined);
        }
    );
  }

  getIdentityTmp(searchStr: string) {
    this.upis$.next(IdentityData.identities.filter(identity => 
      identity.firstName.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) > -1)
    );
  }

  getIdentityUPITmp(inUpi: string) {
    this.upis$.next(IdentityData.identities.filter(identity => 
      identity.staffUpi.toLocaleLowerCase().indexOf(inUpi.toLocaleLowerCase()) > -1));
  }

  getIdentityWithLastNameTmp(firstName: string, lastName: string) {
    this.upis$.next(IdentityData.identities.filter(identity => 
      identity.firstName.toLocaleLowerCase().indexOf(firstName.toLocaleLowerCase()) > -1 || 
      identity.lastName.toLocaleLowerCase().indexOf(lastName.toLocaleLowerCase()) > -1
    ));
  }
}
