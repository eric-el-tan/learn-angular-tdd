import { TableCol, TableColType } from '../components/people-table/table';

export class StudentUiHelper {

  static generateTableColumn(headers: string[], columnIds: string[]): TableCol[] {
    
    const allColumns = 10.70;
    const numberOfYears = headers.length;
    let columnWidth = allColumns/ (numberOfYears+4);
    let programmeColumn = columnWidth + columnWidth;
    
    
    let listTableCols: TableCol[] = [
      { header: 'Student', field: 'nameDisplay', size: columnWidth, type: TableColType.str },
      { header: 'Programme', field: 'titleDisplay', size: programmeColumn, type: TableColType.str },
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
}