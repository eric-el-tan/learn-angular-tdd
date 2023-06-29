export class User {
  empId: string;
  emplId: string;
  name: string;
  email: string;
  staffUpi: string;
  firstName: string;
  lastName: string;
  firstTeams?: string[] = [];
  selectedTeam?: string[] = [];
  authorizedApps?: string[] = [];
  isAdmin?: boolean;
  isTestMode?: boolean;
}

export class CurrentUser {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  personId: string;
  staffUpi: string;
  isResearchAdmin: boolean;
  isToolAdmin: boolean;
  isAcademic: boolean;
  isAuthorisedUser: boolean;
  isAdmin?: boolean;
}