import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrumbsService {

  constructor() { }

  getCrumbs(): string[] {
    return window.location.pathname.split('/').filter(path => path !== '');
  }

  getDecodedCrumbs(): string[] {
    return this.getCrumbs().map((path) => decodeURI(path));
  }
}