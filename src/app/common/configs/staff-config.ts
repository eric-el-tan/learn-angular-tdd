import { Injectable } from "@angular/core";
import { StaffType } from "../entities/people/staff";

@Injectable({
  providedIn: 'root'
})
export class StaffConfig {
  static supportedBands: string[] = ['BU','CU','DU','EU','FU','GU','HM','HP','HU'];

  static psHrKnownGradeMap = new Map([
      ['PRS','PR'],
      ['PRA','PR'],
      ['APA','AP'],
      ['APS','AP'],
      ['AFS','AP'],
      ['SLA','SL'],
      ['SLS','SL'],
      ['LRS','LR'],
      ['SRS','SRF'],
      ['RFS','RF'],
      ['PTS','PTF'],
      ['STS','ST'],
      ['TTS','T'],
      ['PDS','PDF'],
    
      ['BU','B'],
      ['CU','C'],
      ['DU','D'],
      ['EU','E'],
      ['FU','F'],
      ['GU','G'],
      ['HM','HM'],
      ['HP','HP'],
      ['HU','H'],
      ['IM','IM'],
      ['IP','IP'],
      ['IU','I'],
      ['JP','JP'],
      ['JU','J'],
      ['KP','KP'],
      ['KU','K'],
      ['LP','LP'],
      ['LU','L'],
    ]);

          // // Legacy Professional Grades
          // 'G1S','B'
          // 'G2S','C'
          // 'G3S','D'
          // 'G4S','E'
          // 'G5S','F'
          // 'G6S','G'
          // 'GES',this.GRADE_NOT_SUPPORTED
    
          // // Current Professional Grades
          // 'MP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'NP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'OP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'PP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'QP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'RP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'SP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'TP',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'GNS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
    
          // // Other Academic Grades
          // 'TAS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'PDS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'GRS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'GTS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ALS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ANA',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ANS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ARS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ASM',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          
          // // Excluded Professional Grades
          // 'AUL',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ESS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'SES',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'TRS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'UNS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'EAL',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'EQT',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'ITS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
          // 'UTS',this.GRADE_NOT_SUPPORTED);// not in ps hr 
    

  static readonly modalStatus = {
    new: '1_new',
    identityRequested: '2_identity requested',
    identityResponsed: '3_identity responsed',
    salaryRequested: '4_salary requested',
    salaryResponsed: '5_salary responsed',
    salaryResponsedNull: '6_salary responsed null',
    salaryNotSupported: '7_salary not supported',
    salaryContractNotSupported: '8_salary contract not supported',
    exit: '9_exit'
  };
  static readonly psHrModalStatus = {
    new: '1_new',
    contractRequested: '2_contract requested',
    contractResponded: '3_contract responded',
    salaryRequested: '4_salary requested',
    salaryResponded: '5_salary responded',
    salaryRespondedNull: '6_salary responded null',
    salaryNotSupported: '7_salary not supported',
    salaryContractNotSupported: '8_salary contract not supported',
    exit: '9_exit'
  };

  static toStaffGrade(psGrade: string): string {
    return StaffConfig.psHrKnownGradeMap.get(psGrade);
  }

  static toStaffType(psGrade: string) {
    let grade: string = this.toStaffGrade(psGrade);
    return (grade == 'PR' || grade == 'AP') ? StaffType.AcademicPlus
    : (grade == 'SL' || grade == 'LR' 
      || grade == 'SRF' || grade == 'RF' 
      || grade == 'PTF' 
      || grade == 'ST' || grade == 'T'
      || grade == 'PDF')? StaffType.Academic
    : (grade != undefined) ? StaffType.Professional : null;
  }

  static getAcademicProjectRoles(grade: string) {
    return StaffConfig.academicProjectRoleMap.find((map) => map.grade === grade)?.projectRoles;
  }

  static getProfessionalProjectRoles(band: string = 'Collective-Professional') {
    return StaffConfig.professionalProjectRoleMap.find((map) => map.band === band)?.projectRoles;
  }


  //#todo:remove this map in future, any grade can have any role
  static readonly academicProjectRoleMap: Array<any> = [
    {
      grade: 'PR',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator'],
    },
    { 
      grade: 'AP', 
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator']
    },
    {
      grade: 'SRF',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator'],
    },
    {
      grade: 'SL',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator'],
    },
    {
      grade: 'RF',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
    {
      grade: 'LR',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
    {
      grade: 'PTF',
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
    {
      grade: 'ST', // no record in PS HR DB, for unnamed staff
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
    {
      grade: 'T', // no record in PS HR DB, for unnamed staff
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
    {
      grade: 'PDF', // no record in PS HR DB, for unnamed staff
      projectRoles: ['Principal Investigator', 'Associate Investigator', 'Investigator', 'Post-Doctoral Fellow'],
    },
  ];

  static readonly professionalProjectRoleMap: Array<any> = [
    {
      band: 'Collective-Professional',
      projectRoles: ['Research Assistant', 'Technical Assistant', 'Other Staff'],
    },
  ]
}