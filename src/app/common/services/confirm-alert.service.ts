import {Injectable} from '@angular/core';
import {AlertController, IonicSafeString} from '@ionic/angular';
import {DomSanitizer} from "@angular/platform-browser";

class ConfirmAlert {
  title: string;
  titleIcon: string;
  alertMessage: string;
  confirmAction: any;
  cancelAction?: any;
  processingMsg?: string;
  confirmPhrase?: string;
  placeholder?: string;
  successAlertDisplayTime?: number;
}
class Alert {
  title: string;
  titleIcon: string;
  alertMessage: string;
  cancelAction?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmAlertService {
  private defaultSuccessAlertDisplayTime = 2000;
  constructor(private alertController: AlertController, private domSanitizer : DomSanitizer) { }

  async confirm(confirmAlert: ConfirmAlert) {
    const id = Date.now()+'';
    confirmAlert.successAlertDisplayTime = confirmAlert.successAlertDisplayTime || this.defaultSuccessAlertDisplayTime;
    const alert = await this.alertController.create({
      id: id,
      cssClass: 'uoa-modal uoa-alert',
      message: ConfirmAlertService.getMessage(confirmAlert, id),
      buttons: this.getConfirmButtons(()=> {return alert}, confirmAlert),
      inputs: ConfirmAlertService.getConfirmInput(confirmAlert)
    });
    await alert.present();
  }

  async input(confirmAlert: ConfirmAlert) {
    const id = Date.now()+'';
    confirmAlert.successAlertDisplayTime = confirmAlert.successAlertDisplayTime || this.defaultSuccessAlertDisplayTime;
    const alert = await this.alertController.create({
      id: id,
      cssClass: 'uoa-modal uoa-alert',
      message: ConfirmAlertService.getMessage(confirmAlert, id),
      buttons: this.getButtons(()=> {return alert}, confirmAlert),
      inputs: ConfirmAlertService.getInput(confirmAlert)
    });
    await alert.present();
  }

  async alert(alert:Alert) {
    const id = Date.now()+'';
    const alertDialog = await this.alertController.create({
      id: id,
      cssClass: 'uoa-modal uoa-alert',
      message: ConfirmAlertService.getMessage(alert, id),
      buttons: [this.getDismissButton(alert, 'Ok')]
    });
    await alertDialog.present();
  }
  private static getMessage(confirmAlert: ConfirmAlert | Alert, id: string): IonicSafeString{
    return new IonicSafeString( `
        <div class="uoa-alert-header">
            <ion-icon class="uoa-alert-header-icon" name="${confirmAlert.titleIcon}"></ion-icon>${confirmAlert.title}</div>
        </div>
        <div class="uoa-alert-content">
            ${confirmAlert.alertMessage}            
        </div>       
        <div id='err-${id}'></div>             
        `);
  }


  private getDismissButton(confirmAlert: ConfirmAlert | Alert, buttonText: string = 'Cancel'){
    return {
      text: buttonText,
      role: 'cancel',
      cssClass: 'uoa-alert-button-primary',
      handler: () => {
        if (confirmAlert.cancelAction) {
          confirmAlert.cancelAction();
        }
      }
    }
  }

  private getConfirmButtons(alertProvider: any, confirmAlert: ConfirmAlert){
    const cancelButton = this.getDismissButton(confirmAlert);
    const yesButton = {
      text: 'Yes',
      role: 'yes',
      cssClass: 'uoa-alert-button-danger',
      handler: (data) => {
        const alert = alertProvider.apply();
        const errDiv = document.querySelector(`#err-${alert.id}`)
        if(errDiv) {
          errDiv.innerHTML = '';
          if(confirmAlert.confirmPhrase && data.confirmPhrase !== confirmAlert.confirmPhrase){
            errDiv.innerHTML = ConfirmAlertService.getConfirmPhraseError(confirmAlert);
            return false;
          }
        }
        alert.message = `<div class="uoa-alert-processing"><ion-spinner class="uoa-alert-processing-icon"></ion-spinner>${confirmAlert.processingMsg || 'Processing...'}</div>`
        alert.buttons = [];
        alert.inputs = [];
        alert.header = '';
        confirmAlert.confirmAction().then(result => {
          alert.message = ConfirmAlertService.getSuccessMsg(result, confirmAlert);
          alert.buttons = [this.getDismissButton(confirmAlert)];
          alert.buttons[0].text = "Close";
          if(confirmAlert.successAlertDisplayTime > 0){
            setTimeout(() => alert.dismiss(), confirmAlert.successAlertDisplayTime);
          }
        }, err => {
          alert.message = ConfirmAlertService.getErrorMsg(err, confirmAlert);
          alert.buttons = buttons;
          alert.buttons[1].text = "Retry";
        });
        return false;
      }
    }

    const buttons = [cancelButton, yesButton]
    return buttons;
  }

  private getButtons(alertProvider: any, confirmAlert: ConfirmAlert) {
    const cancelButton = this.getDismissButton(confirmAlert);
    const confirmButton = {
      text: 'Confirm',
      role: 'confirm',
      cssClass: 'uoa-alert-button-danger',
      handler: (data) => {
        const alert = alertProvider.apply();
        document.querySelector(`#err-${alert.id}`).innerHTML = '';
        confirmAlert.confirmAction(data).then(() => {
          alert.dismiss();
        }, err => {
          document.querySelector(`#err-${alert.id}`).innerHTML = ConfirmAlertService.getInputError(err);
        });
        return false;
      }
    }
    const buttons = [cancelButton, confirmButton]
    return buttons;
  }

  private static getConfirmInput(confirmAlert: ConfirmAlert) {
    if(!confirmAlert.confirmPhrase) {
      return [];
    }
    const confirmPhraseInput = {
      name: 'confirmPhrase',
      placeholder: `Type '${confirmAlert.confirmPhrase}' here to confirm.`,
      cssClass: 'uoa-alert-phrase'
    }
    return [confirmPhraseInput];
  }

  private static getInput(confirmAlert: ConfirmAlert) {
    const valueInput = {
      name: 'valueInput',
      placeholder: `${confirmAlert.placeholder}`,
      cssClass: 'uoa-alert-phrase'
    }
    return [valueInput];
  }

  private static getInputError(err: string): string{
    return `<div class="uoa-error-text" >
       <br>${err}
     </div>`
  }

  private static getConfirmPhraseError(confirmAlert: ConfirmAlert): string{
    return `<div class="uoa-error-text" >
       <br>Confirmation phrase does not match '${confirmAlert.confirmPhrase}'.
     </div>`
  }

  private static getSuccessMsg(result: string, confirmAlert: ConfirmAlert): IonicSafeString {

    return new IonicSafeString(`<div class="uoa-alert-header uoa-state running">
              <ion-icon class="uoa-alert-header-icon uoa-state-text running" name="${confirmAlert.titleIcon}"></ion-icon>
              ${confirmAlert.title}
            </div>
            <div class="uoa-alert-content">
                 ${result}
            </div>`);
  }

  private static getErrorMsg(err, confirmAlert): string{
    return `<div class="uoa-alert-header uoa-state failed">
                <ion-icon class="uoa-alert-header-icon uoa-state-text failed" name="${confirmAlert.titleIcon}"></ion-icon>
                ${confirmAlert.title}
            </div>
            <div class="uoa-alert-content uoa-error-text">
                ${err || 'Unable to process.'}       
            </div>`
  }

}
