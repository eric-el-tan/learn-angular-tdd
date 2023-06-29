import { AlertOptions } from "@ionic/core";
import { TableCol, TableColType } from '../components/people-table/table';
import { GroupService } from './group.service';
import { AccessProject } from '../entities/loginUser';

export class AccessUiHelper {

  static getAlertOptions(accessProject: AccessProject, _groupService: GroupService): AlertOptions {
    let deleteModal: AlertOptions = {};
    deleteModal.cssClass = 'my-custom-class';
    deleteModal.header = 'Warning!';
    deleteModal.message = `This will delete: ${accessProject.name}. <br><strong>This is not reversable.</strong>`;
    deleteModal.buttons = [];
    deleteModal.buttons.push({
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
    });
    deleteModal.buttons.push({
      text: 'Delete',
      handler: async () => {
        console.log(`Confirm Delete: ${accessProject.name} userId ${accessProject.userId}`);
        try {
          await _groupService.deleteAccessProject(accessProject);
        } catch (err) {
          console.error(err);
        }
      },
    });    
    return deleteModal;
  }

  static generateTableColumn(): TableCol[] {
    let listTableCols: TableCol[] = [
      {header: 'Role', field: 'accessTypeDescription', size: 2, type: TableColType.str, format:'titleCase'},
      {header: 'Name', field: 'name', size: 2, type: TableColType.str, format:'titleCase'},
      {header: 'ID Number', field: 'userId', size: 3, type: TableColType.str},
    ];
    return listTableCols;
  }
}