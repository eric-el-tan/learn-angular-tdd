import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IncentiveData} from "../entities/people/IncentiveData";
import {BypassErrorService} from "@uoa/error-pages";

@Injectable({
  providedIn: 'root'
})
export class DeptIncentiveService {
  constructor(private _https: HttpClient,
              private _bypass : BypassErrorService) {}
  getIncentiveData(upi:string){
    console.log(`getIncentiveData ${environment.apiServer}/incentiveData/search?upi=${upi}`);
    const query = `${environment.apiServer}/incentiveData/search?upi=${upi}`
    this._bypass.bypassError(query, [502, 404, 400, 500])

    return this._https.get<IncentiveData>(query)
  }
}
