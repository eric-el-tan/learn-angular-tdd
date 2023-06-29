import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfessionalStandardisedRate, AcademicStandardisedRate } from '../entities/salary';
import { StaffConfig } from '../configs/staff-config';

@Injectable({
  providedIn: 'root',
})
export class PeopleSoftService {
  public apiServer = environment.apiServer;
  public academicRateCards$ = new BehaviorSubject<AcademicStandardisedRate[]>(null);
  public professionalRateCards$ = new BehaviorSubject<ProfessionalStandardisedRate[]>(null);

  constructor(private _http: HttpClient) {}

  isProfessional(arr: ProfessionalStandardisedRate[] | AcademicStandardisedRate[]): arr is ProfessionalStandardisedRate[] {
    return 'band' in arr[0];
  }

  getStandardizedWages(rateCardType: 'Collective-Academic' | 'professional') {
    console.log(`getRatecard: ${this.apiServer}/psft/salaries/standardized-wage/${rateCardType}`);1
    this._http
      .get<ProfessionalStandardisedRate[] | AcademicStandardisedRate[]>(`${this.apiServer}/psft/salaries/standardized-wage/${rateCardType}`)
      .toPromise()
      .then((result) => {
        if (!this.isProfessional(result)) {
          this.academicRateCards$.next(result);
          console.log(`get academic ratecard: `, result);
        } else {
          let filteredProfessionalRatecards = result.filter(i => StaffConfig.supportedBands.indexOf(i.band) > -1);
          filteredProfessionalRatecards.sort((a,b) => a.band.localeCompare(b.band));
          console.log(`filtered Professional Ratecards: `, filteredProfessionalRatecards);
          this.professionalRateCards$.next(filteredProfessionalRatecards);
        }
      });
  }
}
