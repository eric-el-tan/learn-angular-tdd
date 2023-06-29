import { CostService } from './cost.service';
import { AlertOptions } from "@ionic/core";
import { DirectCostTableCol, DirectCostTableColType } from "../components/directCost-table/directCost-table";
import { SubcontractingCost } from '../entities/nonPeople/subcontractingCost';

export class SubcontractingCostUiHelper {

  static getAlertOptions(contractForServiceCost: SubcontractingCost, _costService: CostService): AlertOptions {
    let deleteModal: AlertOptions = {};
    deleteModal.cssClass = 'my-custom-class';
    deleteModal.header = 'Warning!';
    deleteModal.message = `This will delete: ${contractForServiceCost.nonPeopleDescription}. <br><strong>This is not reversable.</strong>`;
    deleteModal.buttons = [];
    deleteModal.buttons.push({
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
    });
    deleteModal.buttons.push({
      text: 'Delete',
      handler: async () => {
        console.log(`Confirm Delete: ${contractForServiceCost.nonPeopleType} contract for service cost ${contractForServiceCost.nonPeopleDescription}`);
        try {
          await _costService.deleteCost(contractForServiceCost);
        } catch (err) {
          console.error(err);
        }
      },
    });    
    return deleteModal;
  }

  static generateTableColumn(headers: string[], columnIds: string[]): DirectCostTableCol[] {
    
    const allColumns = 10.75;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears + 4); 
    let otherColumn = columnWidth + (columnWidth/2);
    
    
    let listTableCols: DirectCostTableCol[] = [
      { header: 'Description', field: 'nonPeopleDescription', size: otherColumn, type: DirectCostTableColType.str},
      { header: 'Institution', field: 'institution', size: otherColumn, type: DirectCostTableColType.str},
    ];
    for (let i = 0; i < headers.length; i++) {
      let tableCol: DirectCostTableCol = {
        header: headers[i],
        field: 'costPeriods',
        arrField: true,
        arrIndex: i,
        columnId: columnIds[i],
        size: columnWidth,
        type: DirectCostTableColType.currency,
        format: 'currency',
      };
      listTableCols.push(tableCol);
    }
    let tableCol2: DirectCostTableCol = {
      header: 'Total',
      field: 'costTotal',
      columnId: 'total',
      size: columnWidth,
      type: DirectCostTableColType.currency,
      format: 'currency',
    };
    listTableCols.push(tableCol2);
    return listTableCols;
  }
}