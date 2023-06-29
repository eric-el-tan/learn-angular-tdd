export function isSuperUser(adGroups: String[]): boolean {
  if (adGroups) {
    for (let group of adGroups){
      if (group === 'TOOL_ADMIN'){
        return true;
      }
    }
  }
  return false; 
}