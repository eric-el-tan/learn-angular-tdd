import { Injectable } from '@angular/core';
import { UoaErrorsConfig } from '@uoa/error-pages';

@Injectable({
  providedIn: 'root'
})
export class AppErrorsConfig extends UoaErrorsConfig {
  constructor() {
    super();

    this.clientErrorCodes =  [401, 403];
    this.serverErrorCodes = [];
  }
}