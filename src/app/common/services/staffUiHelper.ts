import { PeopleCost } from './../entities/people/peopleCost';
import { NamedStaffService } from './named-staff.service';
import { CostService } from './cost.service';
import { AlertOptions } from "@ionic/core";
import { TableCol, TableColType } from '../components/people-table/table';

export class StaffUiHelper {

  static getAlertOptions(staff: PeopleCost, _namedStaffService: NamedStaffService ,_costService: CostService): AlertOptions {
    let deleteModal: AlertOptions = {};
    deleteModal.cssClass = 'my-custom-class';
    deleteModal.header = 'Warning!';
    deleteModal.message = `This will delete: ${staff.nameDisplay}. <br><strong>This is not reversable.</strong>`;
    deleteModal.buttons = [];
    deleteModal.buttons.push({
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
    });
    deleteModal.buttons.push({
      text: 'Delete',
      handler: async () => {
        console.log(`Confirm Delete: ${staff.peopleType} staff ${staff.nameDisplay}`);
        try {
          await _costService.deleteCost(staff);
        } catch (err) {
          console.error(err);
        }
      },
    });    
    return deleteModal;
  }

  static generateTableColumn(headers: string[], columnIds: string[]): TableCol[] {
    const allColumns = 10.70;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears + 4);
    let nameColumn = columnWidth + 0.25;
    let levelColumn = columnWidth - 0.25;    
    
    let listTableCols: TableCol[] = [
      { header: 'Staff', field: 'nameDisplay', size: nameColumn, type: TableColType.str },
      { header: 'Project Role', field: 'projectRole', size: columnWidth, type: TableColType.str, format: 'titleCase' },
      { header: 'Level', field: 'titleDisplay', size: levelColumn, type: TableColType.str },
    ];
    for (let i = 0; i < headers.length; i++) {
      let tableCol: TableCol = {
        header: headers[i],
        field: 'totalSalaryMap',
        mapField: true,
        mapIndex: i,
        columnId: columnIds[i], // 2022-01-15
        size: columnWidth,
        type: TableColType.currency,
        format: 'currency',
      };
      listTableCols.push(tableCol);
    }
    let tableCol2: TableCol = {
      header: 'Total',
      field: 'totalSalaryMap',
      mapField: true,
      mapFunc: 'sum',
      columnId: 'total',
      size: columnWidth,
      type: TableColType.currency,
      format: 'currency',
    };
    listTableCols.push(tableCol2);
    // let tableCol3: TableCol = {header: 'Modified At', field: 'modifiedAt', size: 1, type: TableColType.date, format: 'dd MMM, yyyy'};
    // let tableCol4: TableCol = {header: 'Modified By', field: 'modifiedBy.name', size: 1, type: TableColType.str};
    return listTableCols;
  }
}