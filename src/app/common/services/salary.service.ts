import { Injectable } from '@angular/core';
import { DoctoralRate } from '../entities/rule';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor() { }
  static domesticPhdTuition: DoctoralRate;
  static internationPhdTuition: DoctoralRate;
  static domesticMasterTuition: DoctoralRate;
  static internationMasterTuition: DoctoralRate; 

  // use FunderRule.phdStipendAnnualLimit instead ofthis 
  static doctoralStipend = [
    { year: '2023', fee: 33000 },
    { year: '2022', fee: 28984.5 },
    { year: '2021', fee: 28500 },
  ];

  // use FunderRule.mastersStipendAnnualLimit instead of this
  static masterStipend = [
    { year: '2023', fee: 13655 },
    { year: '2022', fee: 13655 },
    { year: '2021', fee: 13520 },
  ];

  static doctoralTuition = [
    { type: 'domestic', year: '2023', programme: 'philosophy', fee: 6660.5 }, 
    { type: 'international', year: '2023', programme: 'philosophy', fee: 6660.5 }, 
    { type: 'domestic', year: '2022', programme: 'philosophy', fee: 6373.6 }, 
    { type: 'international', year: '2022', programme: 'philosophy', fee: 6373.6 }, 
    { type: 'domestic', year: '2021', programme: 'philosophy', fee: 6304.7 }, 
    { type: 'international', year: '2021', programme: 'philosophy', fee: 6304.7 },
  ];

  static masterTuition = [ 
    { type: 'domestic', year: '2023', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 67.76 }, 
    { type: 'domestic', year: '2023', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 76.61 }, 
    { type: 'domestic', year: '2023', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 77.20 },
    { type: 'domestic', year: '2023', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture', fee: 68.95 },
    { type: 'domestic', year: '2023', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 73.50 },
    { type: 'domestic', year: '2023', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 76.43 },
    { type: 'domestic', year: '2023', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 76.43 },
    { type: 'domestic', year: '2023', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 68.95 },
    { type: 'domestic', year: '2023', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 67.76 },
    { type: 'domestic', year: '2023', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 86.67 },
    { type: 'domestic', year: '2023', faculty: 'LPR', band:'STD', bandDescription: 'Law Standard', fee: 77.20 },
    { type: 'domestic', year: '2023', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 76.61 },
    { type: 'domestic', year: '2023', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 78.00 },
    { type: 'domestic', year: '2023', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 71.88 },
    { type: 'domestic', year: '2023', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 76.61 },
    { type: 'international', year: '2023', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 328.89 }, 
    { type: 'international', year: '2023', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 385.86 }, 
    { type: 'international', year: '2023', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 348.15 }, 
    { type: 'international', year: '2023', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture',fee: 405.18 },  
    { type: 'international', year: '2023', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 356.78 }, 
    { type: 'international', year: '2023', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 344.84 }, 
    { type: 'international', year: '2023', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 405.18 }, 
    { type: 'international', year: '2023', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 344.84 }, 
    { type: 'international', year: '2023', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 318.94 }, 
    { type: 'international', year: '2023', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 405.18 }, 
    { type: 'international', year: '2023', faculty: 'LPR', band:'STD', bandDescription:'Law Standard' , fee: 354.88 }, 
    { type: 'international', year: '2023', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 403.22 }, 
    { type: 'international', year: '2023', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 403.22 }, 
    { type: 'international', year: '2023', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 405.18 }, 
    { type: 'international', year: '2023', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 405.18 },
    { type: 'domestic', year: ' ', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 65.95 }, 
    { type: 'domestic', year: '2022', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 74.56 }, 
    { type: 'domestic', year: '2022', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 75.13 },
    { type: 'domestic', year: '2022', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture', fee: 67.10 },
    { type: 'domestic', year: '2022', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 71.53 },
    { type: 'domestic', year: '2022', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 74.38 },
    { type: 'domestic', year: '2022', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 74.38 },
    { type: 'domestic', year: '2022', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 67.10 },
    { type: 'domestic', year: '2022', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 65.95 },
    { type: 'domestic', year: '2022', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 84.35 },
    { type: 'domestic', year: '2022', faculty: 'LPR', band:'STD', bandDescription: 'Law Standard', fee: 75.13 },
    { type: 'domestic', year: '2022', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 74.56 },
    { type: 'domestic', year: '2022', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 75.91 },
    { type: 'domestic', year: '2022', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 69.96 },
    { type: 'domestic', year: '2022', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 74.56 },
    { type: 'international', year: '2022', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 315.76 }, 
    { type: 'international', year: '2022', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 371.02 }, 
    { type: 'international', year: '2022', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 334.76 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture',fee: 389.60 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'DESIGN', bandDescription: 'Design', fee: 389.60 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 343.06 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 331.58 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 389.60 }, 
    { type: 'international', year: '2022', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 331.58 }, 
    { type: 'international', year: '2022', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 306.67 }, 
    { type: 'international', year: '2022', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 389.60 }, 
    { type: 'international', year: '2022', faculty: 'LPR', band:'STD', bandDescription:'Law Standard' , fee: 341.23 }, 
    { type: 'international', year: '2022', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 387.71 }, 
    { type: 'international', year: '2022', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 387.71 }, 
    { type: 'international', year: '2022', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 389.60 }, 
    { type: 'international', year: '2022', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 389.60 },
    { type: 'domestic', year: '2021', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 64.14 }, 
    { type: 'domestic', year: '2021', faculty: 'APR', band:'THEO', bandDescription: 'Arts Theology', fee: 64.14 },
    { type: 'domestic', year: '2021', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 72.51 }, 
    { type: 'domestic', year: '2021', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 73.07 },
    { type: 'domestic', year: '2021', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture', fee: 65.26 },
    { type: 'domestic', year: '2021', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 69.56 },
    { type: 'domestic', year: '2021', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 72.51 },
    { type: 'domestic', year: '2021', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 72.51 },
    { type: 'domestic', year: '2021', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 65.26 },
    { type: 'domestic', year: '2021', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 64.14 },
    { type: 'domestic', year: '2021', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 82.04 },
    { type: 'domestic', year: '2021', faculty: 'LPR', band:'STD', bandDescription: 'Law Standard', fee: 73.07 },
    { type: 'domestic', year: '2021', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 72.51 },
    { type: 'domestic', year: '2021', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 73.83 },
    { type: 'domestic', year: '2021', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 68.04 },
    { type: 'domestic', year: '2021', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 72.51 },
    { type: 'international', year: '2021', faculty: 'APR', band:'STD', bandDescription: 'Arts Standard', fee: 300.72 }, 
    { type: 'international', year: '2021', faculty: 'APR', band:'THEO', bandDescription: 'Arts Theology', fee: 300.72 }, 
    { type: 'international', year: '2021', faculty: 'APR', band:'PRM', bandDescription: 'Arts Premium', fee: 353.35 }, 
    { type: 'international', year: '2021', faculty: 'BPR', band:'STD', bandDescription: 'Business Standard', fee: 318.82 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'ARC', bandDescription: 'Architecture',fee: 371.05 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'DESIGN', bandDescription: 'Design', fee: 357.06 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'FA', bandDescription: 'Fine Arts', fee: 343.06 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'MUS', bandDescription: 'Music', fee: 315.79 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'PA', bandDescription: 'Performing Arts', fee: 371.05 }, 
    { type: 'international', year: '2021', faculty: 'CPR', band:'PLN', bandDescription: 'Urban Planning', fee: 315.79 }, 
    { type: 'international', year: '2021', faculty: 'DPR', band:'STD', bandDescription: 'Education Standard', fee: 292.07 }, 
    { type: 'international', year: '2021', faculty: 'EPR', band:'STD', bandDescription: 'Engineering Standard', fee: 371.05 }, 
    { type: 'international', year: '2021', faculty: 'LPR', band:'STD', bandDescription:'Law Standard' , fee: 324.98 }, 
    { type: 'international', year: '2021', faculty: 'MPR', band:'STD', bandDescription: 'Med Standard', fee: 369.25 }, 
    { type: 'international', year: '2021', faculty: 'MPR', band:'OPTOM', bandDescription: 'Med Optometry', fee: 369.25 }, 
    { type: 'international', year: '2021', faculty: 'SPR', band:'STD', bandDescription: 'Science Standard', fee: 371.05 }, 
    { type: 'international', year: '2021', faculty: 'SPR', band:'PRM', bandDescription: 'Science Premium', fee: 371.05 },
  ];

  static insuranceFees = [
    { year: '2023', fee: 652.2 },
    { year: '2022', fee: 582.6 },
  ];
  
  static studentServiceFees = [
    { year: '2023', fee: 874.4 },
    { year: '2022', fee: 820.2 },
  ];

  static getDoctoralStipend(year: string): number {
    return SalaryService.doctoralStipend.filter((i) => i.year == year)[0].fee;
  }

  static getMasterStipend(year: string): number {
    return SalaryService.masterStipend.filter((i) => i.year == year)[0].fee;
  }

  static getDoctoralTuitionFee(international: boolean = true, year: string, programme: string): number {
    const type = international?'international':'domestic';
    return SalaryService.doctoralTuition.filter((i) => i.type == type && i.year == year && i.programme == programme)[0].fee;
  }
  
  static getMasterTuitionFee(international: boolean, year: string, faculty: string, band: string): number {
    const type = international?'international':'domestic';
    return SalaryService.masterTuition.filter((i) => i.type == type && i.year == year && i.faculty == faculty && i.band == band)[0].fee;
  }

  static getInsurance(year: string): number {
    return SalaryService.insuranceFees.filter((i) => i.year == year)[0].fee
  }

  static getStudentService(year: string): number {
    return SalaryService.studentServiceFees.filter((i) => i.year == year)[0].fee
  }

  static getMasterTuitionOptions(international: boolean, year: string, faculty: string): object[]{
    const type = international?'international':'domestic';
    return SalaryService.masterTuition.filter((i) => i.type == type && i.year == year && i.faculty.includes(faculty));
  }

  static getFacultyBandMap(faculty: string){
    let facultyBandsArray =  SalaryService.masterTuition.filter((i) => i.faculty.includes(faculty) == true).map((j) => j.faculty);
    let uniqueFacultyBandsArray = [...new Set(facultyBandsArray)]
    return uniqueFacultyBandsArray.map((i) => {
      let pos = i.search('-')
      let sliceFacultyBands = i.slice(pos+1)
      return sliceFacultyBands;
    });
  }

  static getStudentBandLabel(band: string){
    return SalaryService.masterTuition.filter((i) => i.faculty.includes(band))[0].band
  }
}
