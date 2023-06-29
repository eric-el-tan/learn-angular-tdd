import { ProjectAccess } from './../entities/loginUser';
import { Project } from 'src/app/common/entities/project';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProjectAccessData {

  public static projectAccesses: ProjectAccess[] = [
    { 
      accessId: '1',
      projectId: '1632777186504',
      accessType: 'editor',
      userInfo: {
        empId: '6878295',
        name: 'Jingjing Liu',
        email: 'jingjing.liu@auckland.ac.nz',
        firstName: 'Jingjing',
        lastName: 'Liu',
        staffUpi: 'jliu865'
      },
    },
    { 
      accessId: '2',
      projectId: '1632777186504',
      accessType: 'administrator',
      userInfo: {
        empId: '241555949',
        name: 'Monette Tanagon',
        email: 'r.tanagon@auckland.ac.nz',
        firstName: 'Monette',
        lastName: 'Tanagon',
        staffUpi: 'rtan513'
      },
    },
    { 
      accessId: '6',
      projectId: '1632777186504',
      accessType: 'administrator',
      userInfo: {
        empId: '241555949',
        name: 'Eric Tan',
        email: 'eric.tan@auckland.ac.nz',
        firstName: 'Eric',
        lastName: 'Tan',
        staffUpi: 'etan221'
      },
    },
    { 
      accessId: '3',
      projectId: '1632877710416',
      accessType: 'administrator',
      userInfo: {
        empId: '3044367',
        name: 'June-Chiew Han',
        email: 'j.han@auckland.ac.nz',
        firstName: 'June-Chiew',
        lastName: 'Han',
        staffUpi: 'jhan083'
      },
    },
    { 
      accessId: '4',
      projectId: '1631489750857',
      accessType: 'administrator',
      userInfo: {
        email: 'd.belsten@auckland.ac.nz',
        empId: '2346435',
        name: 'Denice Belsten',
        firstName: 'Denice',
        lastName: 'Belsten',
        staffUpi: 'dwhi063'
      },
    },
    { 
      accessId: '5',
      projectId: '1619558258931',
      accessType: 'administrator',
      userInfo: {
        empId: '3044367',
        name: 'TahuaRangahauResearchAdmin_users',
        email: 'j.han@auckland.ac.nz',
      },
    },
  ];
}