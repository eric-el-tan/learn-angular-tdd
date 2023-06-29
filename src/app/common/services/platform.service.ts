import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor() { }

  isPhone() {
    return window.innerWidth <= 576;
  }

  isMobile(){
    return  window.innerWidth <= 768;
  }

  isTablet() {
    return window.innerWidth <= 1120;
  }
}
