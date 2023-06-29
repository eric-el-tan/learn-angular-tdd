export interface ProjectAuditRecord {
  PROJECTID: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  accessedByUpi: string;
  accessedByName: string;
  TIMESTAMP: number;
}