import { Project } from 'src/app/common/entities/project';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProjectData {

public static projects: Project[] = [
  { 
    projectId: '1632777186504',
    projectCode: '',
    projectName: 'Investigating the imbalance of current distribution and bubble behaviour in electrolysis process',
    estimatedStartDate: '2022-03-01',
    period: 3,
    estimatedEndDate: '2025-02-28',
    principalInvestigator: 'Jingjing Liu',
    faculty: 'Engineering',
    deptCode: 'ABCD',
    pbrfCategory: 'NZ Government Contestable Funds',
    pbrfSubCategory: 'Research Purchase Agencies',
    administrators: [
      {
        email: 'r.tanagon@auckland.ac.nz',
        empId: '241555949',
        name: 'Monette Tanagon'
      }
    ],
    editors: [
      {
        email: 'jingjing.liu@auckland.ac.nz',
        empId: '6878295',
        firstName: 'Jingjing',
        lastName: 'Liu',
        name: 'Jingjing Liu',
        staffUpi: 'jliu865'
      }
    ],
    modifiedAt: '2021-09-27T21:13:06.504Z',
    modifiedBy: {
      email: 'r.tanagon@auckland.ac.nz',
      empId: '241555949',
      name: 'Monette Tanagon'
    },
  },
  { 
    projectId: '1632877710416',
    projectCode: '',
    projectName: 'What makes the heart fail when it beats like a metronome?',
    estimatedStartDate: '2022-03-01',
    period: 3,
    estimatedEndDate: '2025-02-28',
    principalInvestigator: 'June-Chiew Han',
    faculty: 'Auckland Bioengineering Institute',
    deptCode: 'ABCD',
    pbrfCategory: 'NZ Government Contestable Funds',
    pbrfSubCategory: 'Research Purchase Agencies',
    administrators: [
      {
        email: 'j.han@auckland.ac.nz',
        empId: '3044367',
        name: 'June-Chiew Han'
      }
    ],
    editors: [],
    modifiedAt: '2021-09-29T01:19:21.480Z',
    modifiedBy: {
      email: 'j.han@auckland.ac.nz',
      empId: '3044367',
      name: 'June-Chiew Han'
    },
  },
  { 
    projectId: '1619558258931',
    projectCode: '',
    projectName: 'Marsden Standard Test RFM 3723561',
    estimatedStartDate: '2022-03-01',
    period: 3,
    estimatedEndDate: '2025-02-28',
    principalInvestigator: 'Eileen Leuders',
    faculty: 'Science',
    deptCode: 'ABCD',
    pbrfCategory: 'NZ Public Sector Contract Research',
    pbrfSubCategory: 'Tec Or Moe (Core) Research Funding',
    administrators: [
      {
        email: 'j.han@auckland.ac.nz',
        empId: '3044367',
        name: 'TahuaRangahauResearchAdmin_users'
      }
    ],
    editors: [],
    modifiedAt: '2021-07-12T21:56:12.633Z',
    modifiedBy: {
      email: 'eric.tan@auckland.ac.nz',
      empId: '160792387',
      name: 'Eric Tan'
    },
  },
  { 
    projectId: '1632877642549',
    projectCode: '',
    projectName: 'Making a Splash: Accounting for Air in Water Impacts		',
    estimatedStartDate: '2022-01-01',
    period: 3,
    estimatedEndDate: '2024-12-31',
    principalInvestigator: 'Tom Allen',
    faculty: 'Engineering',
    deptCode: 'ABCD',
    pbrfCategory: 'NZ Government Contestable Funds',
    pbrfSubCategory: 'Research Purchase Agencies',
    administrators: [
      {
        name: 'Tom Allen',
        email: 'tom.allen@auckland.ac.nz',
        empId: '3915046'
      }
    ],
    editors: [],
    modifiedAt: '2021-07-12T21:56:12.633Z',
    modifiedBy: {
      email: 'tom.allen@auckland.ac.nz',
      empId: '3915046',
      name: 'Tom Allen'
    },
  },
  { 
    projectId: '1631489750857',
    projectCode: '',
    projectName: 'Tānewhirinaki - Celestial / Terrestrial',
    estimatedStartDate: '2021-11-01',
    period: 1,
    estimatedEndDate: '2022-10-31',
    principalInvestigator: 'Uwe Rieger',
    faculty: 'Creative Arts and Industries',
    deptCode: 'ABCD',
    pbrfCategory: 'NZ Government Contestable Funds',
    pbrfSubCategory: 'Research Purchase Agencies',
    administrators: [
      {
        email: 'd.belsten@auckland.ac.nz',
        empId: '2346435',
        name: 'Denice Belsten'
      }
    ],
    editors: [],
    modifiedAt: '2021-09-12T23:35:50.857Z',
    modifiedBy: {
      email: 'd.belsten@auckland.ac.nz',
      empId: '2346435',
      name: 'Denice Belsten'
    },
  },
];
}