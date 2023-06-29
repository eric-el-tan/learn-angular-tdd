import { StaffData } from './staff.data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { PsStaff } from '../entities/psStaff';

@Injectable({
  providedIn: 'root',
})
export class PsHrService {
  public apiServer = environment.apiServer;
  public staff$ = new Subject<PsStaff[]>();

  constructor(private _http: HttpClient) {}

  getStaffTmp(searchStr: string) {
    this.staff$.next(StaffData.staff.filter((staff) => staff.FIRST_NAME.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) > -1));
  }

  getStaffUPITmp(inUpi: string) {
    this.staff$.next(StaffData.staff.filter((staff) => staff.NATIONAL_ID.toLocaleLowerCase().indexOf(inUpi.toLocaleLowerCase()) > -1));
  }

  getStaffWithLastNameTmp(firstName: string, lastName: string) {
    this.staff$.next(
      StaffData.staff.filter(
        (staff) =>
          staff.FIRST_NAME.toLocaleLowerCase().indexOf(firstName.toLocaleLowerCase()) > -1 ||
          staff.LAST_NAME.toLocaleLowerCase().indexOf(lastName.toLocaleLowerCase()) > -1
      )
    );
  }
}
