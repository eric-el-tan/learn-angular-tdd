import { CostService } from './cost.service';
import { AlertOptions } from "@ionic/core";
import { DirectCostTableCol, DirectCostTableColType } from "../components/directCost-table/directCost-table";
import { DirectCost } from "../entities/nonPeople/directCost";

export class DirectCostUiHelper {

  static getAlertOptions(directCost: DirectCost, _costService: CostService): AlertOptions {
    let deleteModal: AlertOptions = {};
    deleteModal.cssClass = 'my-custom-class';
    deleteModal.header = 'Warning!';
    deleteModal.message = `This will delete: ${directCost.nonPeopleDescription}. <br><strong>This is not reversable.</strong>`;
    deleteModal.buttons = [];
    deleteModal.buttons.push({
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
    });
    deleteModal.buttons.push({
      text: 'Delete',
      handler: async () => {
        console.log(`Confirm Delete: ${directCost.nonPeopleType} staff ${directCost.directCostDescription}`);
        try {
          await _costService.deleteCost(directCost);
        } catch (err) {
          console.error(err);
        }
      },
    });    
    return deleteModal;
  }

  static generateTableColumn(headers: string[], columnIds: string[]): DirectCostTableCol[] {
    
    const allColumns = 10.70;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears + 4); 
    let costcategoryColumn = columnWidth + columnWidth;   
    
    
    let listTableCols: DirectCostTableCol[] = [
      // { header: 'Non People Id', field: 'nonPeopleId', size: 1, type: DirectCostTableColType.str, ctrlType: DirectCostTableCtrlType.displayOnly},
      { header: 'Cost Category', field: 'directCostCategory', size: costcategoryColumn, type: DirectCostTableColType.str, format: 'titleCase', },
      { header: 'Short Description', field: 'nonPeopleDescription', size: columnWidth, type: DirectCostTableColType.str, },
      // { header: 'CAPEX/OPEX', field: 'directCostExpenditureType', size: 1, type: DirectCostTableColType.str, },
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
    // let tableCol3: TableCol = {header: 'Modified At', field: 'modifiedAt', size: 1, type: TableColType.date, format: 'dd MMM, yyyy'};
    // let tableCol4: TableCol = {header: 'Modified By', field: 'modifiedBy.name', size: 1, type: TableColType.str};
    return listTableCols;
  }
}