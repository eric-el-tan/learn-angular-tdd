import { PeopleCost } from '../entities/people/peopleCost';
import { NamedStaffService } from './named-staff.service';
import { CostService } from './cost.service';
import { AlertOptions } from "@ionic/core";
import { TableCol, TableColType } from '../components/people-table/table';

export class SummaryUiHelper {

  static generateDetailColumns(headers: string[], columnIds: string[]): TableCol[] {
    
    const allColumns = 10.75;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears + 4); 

    let listTableCols: TableCol[] = [
      { header: 'Staff', field: 'nameDisplay', size: columnWidth + (columnWidth/2), type: TableColType.str },
      { header: 'Project Role', field: 'projectRole', size: columnWidth + (columnWidth/2), type: TableColType.str, format: 'titleCase' },
    ];
    for (let i = 0; i < headers.length; i++) {
      let tableCol: TableCol = {
        header: headers[i],
        field: 'totalSalaryMap',
        mapField: true,
        mapIndex: i,
        columnId: columnIds[i],
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

  static generateTableColumn(headers: string[], columnIds: string[]): TableCol[] {
    
    const allColumns = 10.75;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears + 4); 
    let otherColumn = columnWidth + (columnWidth/2);
    
    let listTableCols: TableCol[] = [
      { header: '', field: 'cardTitle', size: otherColumn, type: TableColType.str },
      { header: '', field: 'none', size: otherColumn, type: TableColType.str, format: 'titleCase' },
    ];
    for (let i = 0; i < headers.length; i++) {
      let tableCol: TableCol = {
        header: headers[i],
        field: 'totalSalaryMap',
        mapField: true,
        mapIndex: i,
        columnId: columnIds[i],
        size: columnWidth,
        type: TableColType.currency,
        format: 'currency',
      };
      listTableCols.push(tableCol);
    }
    // let tableCol1: TableCol = {
    //   header: 'Staff',
    //   field: 'nameDisplay',
    //   size: 2,
    //   type: TableColType.str,
    //   format: 'titleCase',
    // };
    // listTableCols.push(tableCol1);
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