export interface UserInfo {
  empId: string;  // 160792387
  emplId?: string;  // 160792387
  // sub: string; //806fa561-4d3f-4d40-9f1a-0e41e3343751
  // email_verified: boolean; //false
  // groups: string[] // research-team.its, value-stream-groups.its, mule-developers.its, app-development.its, groupapps.its, sourcecode.its, staffIntranetUser.ec, Employee.psrwi, api-developers.its, apps-dev.its, itsbalsamiqaccess.its, integration-monitor.its
  name: string; //Eric Tan
  // preferred_username: string; //etan221
  // given_name: string; //Eric
  // family_name: string; //Tan
  email: string; //eric.tan@auckland.ac.nz
  // username: string; //uoatestidp_etan221
  firstName?: string;
  lastName?: string;
  staffUpi?: string;
}

export interface LoginAccess {
  userInfo: UserInfo; // 6 kinds of agreement: Collective Academic/Collective Professional/Collective Medical Acedemics / Individual Professional Grade B-G / Individual Professional Grade H-L / Individual Academic // api: Which contract
  ofGroups: string[];
}

export interface ProjectAccess {
  accessId: string;
  projectId: string;
  accessType: string;
  userInfo: UserInfo; // 6 kinds of agreement: Collective Academic/Collective Professional/Collective Medical Acedemics / Individual Professional Grade B-G / Individual Professional Grade H-L / Individual Academic // api: Which contract
}

export interface AccessProject{
  projectId: string;
  accessType?: string;
  userId?: string;
  name?: string;
}