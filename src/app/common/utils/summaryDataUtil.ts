import { ContractForServiceCost } from './../entities/nonPeople/contractForServiceCost';
import { cloneDeep } from 'lodash';
import { NonPeopleType, MapOfCostPeriod } from "../entities/nonPeople/nonPeople";
import { SubcontractingCost } from "../entities/nonPeople/subcontractingCost";
import { ArrayUtil } from "./arrayUtil";

export class SummaryDataUtil {

  public static groupSubcontractingCostByInstitution(tableData: any): SubcontractingCost[] {
    
    let subcontractingCosts: any[] = tableData?.filter(cost => cost.nonPeopleType && cost.nonPeopleType == NonPeopleType.Subcontracting);
    let groupedSubcontractingCostMap: Map<string, any> = ArrayUtil.groupByToMap(subcontractingCosts, 'institution');

    let groupedCosts: SubcontractingCost[] = [];

    for (const keyInstitution of groupedSubcontractingCostMap.keys()){
      let allSubcontractingCosts: SubcontractingCost[] = groupedSubcontractingCostMap.get(keyInstitution);
      let groupedCost: SubcontractingCost = cloneDeep(allSubcontractingCosts[0]) as SubcontractingCost;
      let costPeriodKeys: string[] = groupedCost.costPeriods.map(i => i.key.substring(i.key.length - 'yyyy-mm-dd'.length, i.key.length)); // {'2022-01-15', '2023-01-15', '2024-01-15'}
      
      costPeriodKeys.forEach((keyStartDate) => {
        let costPeriodValues: number[] = allSubcontractingCosts.map(i => {
          let costPeriods: MapOfCostPeriod[] = i.costPeriods;
          let costPeriodValue = costPeriods
            .filter(i => i.key.indexOf(keyStartDate) > -1)   // costPeriod: {"value": 100,"key": "67e45420-ff85-482f-b1b7-482e87c28662-2022-01-15"}
            .map(i => i.value)                      // [100]
            .reduce((a,c)=> a+c, 0.0);              // 100
          return costPeriodValue;
        });                                       // [100,10]
        let costPeriodTotal: number = costPeriodValues.reduce((a,c) => a+c, 0.0); // 110
        groupedCost.costPeriods.find(p => p.key.indexOf(keyStartDate) > -1).value = costPeriodTotal;
      });
      groupedCost.costTotal = allSubcontractingCosts.reduce((acc,cur) => acc + cur.costTotal, 0.0);
      groupedCost.nonPeopleDescription = keyInstitution;
      groupedCosts.push(groupedCost);
    }
    return groupedCosts;
  }

  public static groupContractForServiceCostByInstitution(tableData: any): ContractForServiceCost[] {
    
    let contractForServiceCosts: any[] = tableData?.filter(cost => cost.nonPeopleType && cost.nonPeopleType == NonPeopleType.ContractForService);
    let groupedContractForServiceCostMap: Map<string, any> = ArrayUtil.groupByToMap(contractForServiceCosts, 'institution');

    let groupedCosts: ContractForServiceCost[] = [];

    for (const keyInstitution of groupedContractForServiceCostMap.keys()){
      let allContractForServiceCosts: ContractForServiceCost[] = groupedContractForServiceCostMap.get(keyInstitution);
      let groupedCost: ContractForServiceCost = cloneDeep(allContractForServiceCosts[0]) as ContractForServiceCost;
      let costPeriodKeys: string[] = groupedCost.costPeriods.map(i => i.key.substring(i.key.length - 'yyyy-mm-dd'.length, i.key.length)); // {'2022-01-15', '2023-01-15', '2024-01-15'}
      
      costPeriodKeys.forEach((keyStartDate) => {
        let costPeriodValues: number[] = allContractForServiceCosts.map(i => {
          let costPeriods: MapOfCostPeriod[] = i.costPeriods;
          let costPeriodValue = costPeriods
            .filter(i => i.key.indexOf(keyStartDate) > -1)   // costPeriod: {"value": 100,"key": "67e45420-ff85-482f-b1b7-482e87c28662-2022-01-15"}
            .map(i => i.value)                      // [100]
            .reduce((a,c)=> a+c, 0.0);              // 100
          return costPeriodValue;
        });                                       // [100,10]
        let costPeriodTotal: number = costPeriodValues.reduce((a,c) => a+c, 0.0); // 110
        groupedCost.costPeriods.find(p => p.key.indexOf(keyStartDate) > -1).value = costPeriodTotal;
      });
      groupedCost.costTotal = allContractForServiceCosts.reduce((acc,cur) => acc + cur.costTotal, 0.0);
      groupedCost.nonPeopleDescription = keyInstitution;
      groupedCosts.push(groupedCost);
    }
    return groupedCosts;
  }


}