import { cloneDeep } from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DateUtil } from '../utils/dateUtil';
import { CurrentUser } from '../entities/user';
import { ProjectAuditRecord } from '../entities/projectAuditRecord';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  public apiServer = environment.apiServer;
  public projectAuditRecords$ = new BehaviorSubject<ProjectAuditRecord[]>(null);

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {}

async getAudits(projectId: string) {
    console.log(`getAudits ${this.apiServer}/projects/${projectId}/audit`);
    this._http.get<ProjectAuditRecord[]>(`${this.apiServer}/projects/${projectId}/audit`)
    .toPromise()
    .then(
      (result) => this.projectAuditRecords$.next(result),
      (_) => this.projectAuditRecords$.next(undefined)
    );
  }

}
