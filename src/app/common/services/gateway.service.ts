import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {properties} from "../../../environments/environment";
import {GatewayRequestSummary} from "../entities/gateway-request-summary";
import {Consumer} from "../entities/project-athena";

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private consumerNotUsed: Consumer[];

  constructor(private http: HttpClient) { }

  getAclList(serviceName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.http.get<string[]>(`${properties.athenaApi}/gateway/${serviceName}-${properties.env}/acls`).subscribe(acl => {
        resolve(acl);
      }, err => {
        if(err.status === 404){
          reject(`'${serviceName}' not found on gateway`);
        }
        reject(`Unable to get ACL for '${serviceName}'`);
      })
    })
  }

  getProjectRequestStats(serviceName: string, interval: string): Promise<GatewayRequestSummary>{
    return new Promise((resolve, reject) => {
      this.http.get<GatewayRequestSummary>(`${properties.athenaApi}/gateway/requests/${serviceName}-${properties.env}?interval=${interval}`).subscribe(response => {
        resolve(response);
      }, err => {
        reject('Unable to get project request stats.');
      });
    })
  }

  getInactiveConsumers(refresh: boolean = false): Promise<Consumer[]>{
    return new Promise((resolve, reject) => {
      if(this.consumerNotUsed && !refresh){
        resolve(this.consumerNotUsed);
        return;
      }
      this.http.get<Consumer[]>(`${properties.athenaApi}/gateway/consumers/inactive`).subscribe(consumerNotUsed => {
        this.consumerNotUsed = consumerNotUsed
        resolve(this.consumerNotUsed);
      }, () => {
        reject(`Unable to get inactive consumers.`)
      })
    });
  }
}
