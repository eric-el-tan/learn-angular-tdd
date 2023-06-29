import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FacultyConfig {

  public static getDeptCode(faculty: string): string {
    return FacultyConfig.deptIdFacultyMap.find((item) => item.faculty === faculty).deptCode;
  }

  public static getGroupName(faculty: string): string {
    return FacultyConfig.deptIdFacultyMap.find((item) => item.faculty === faculty).groupName;
  }

  private static readonly deptIdFacultyMap: Array<any> = [
    {
      deptId: 'ARTFAC',
      deptCode: 'ABCD',
      faculty: 'Arts',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'BIOENGINST',
      deptCode: 'ABCD',
      faculty: 'Auckland Bioengineering Institute',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'BUSEC',
      deptCode: 'ABCD',
      faculty: 'Business School',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'CAI',
      deptCode: 'ABCD',
      faculty: 'Creative Arts and Industries',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'EDUFAC',
      deptCode: 'ABCD',
      faculty: 'Education and Social Work',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'ENGFAC',
      deptCode: 'ABCD',
      faculty: 'Engineering',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'LAWFAC',
      deptCode: 'ABCD',
      faculty: 'Law',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'LIGGINS',
      deptCode: 'ABCD',
      faculty: 'Liggins Institute',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'LAWFAC',
      deptCode: 'ABCD',
      faculty: 'Law',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'MEDFAC',
      deptCode: 'ABCD',
      faculty: 'Medical and Health Sciences',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
    {
      deptId: 'SCIFAC',
      deptCode: 'ABCD',
      faculty: 'Science',
      groupName: 'TahuaRangahauResearchAdmin_users',
    },
  ];
}