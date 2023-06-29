import {Injectable} from '@angular/core';
import {ModalEnter, ModalLeave} from '../animations/modal';
import {PlatformService} from './platform.service';
import {ModalController, NavController} from '@ionic/angular';
import { ModalWidth } from '../components/table/table';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private platformService: PlatformService,
              private navController: NavController,
              private modalController: ModalController) {
  }

  async presentModal(component: any, type: ModalWidth, componentProps?: any): Promise<HTMLIonModalElement>{

    const modal = await this.modalController.create({
      component,
      componentProps,
      cssClass: type === ModalWidth.full ? 'uoa-full-modal': 
                type === ModalWidth.normal ? 'uoa-normal-modal': 
                type === ModalWidth.small ? 'uoa-small-modal':'uoa-modal',
      animated: true,
      showBackdrop: true,
      backdropDismiss: true
    });
    await modal.present().then();
    return modal;
  }

  navigateRoot(url: string) {
    this.navController.navigateRoot(url, {animated: false}).then();
  }
  navigateForward(url: string) {
    this.navController.navigateForward(url, {animated: false}).then();
  }
  navigateBack(url?: string) {
    if(url){
      this.navController.navigateBack(url, {animated: false}).then();
    } else {
      this.navController.back();
    }
  }
  dismissValue(data?: any) {
    data ? 
      this.modalController.dismiss(data): 
      this.modalController.dismiss();
  }
  closeModal(closeAll?:boolean) {
    this.modalController.getTop().then(isModalOpen => {
      if(isModalOpen){
        this.modalController.dismiss().then( () => {
          if(closeAll) this.closeModal(true);
        });
      }
    });
  }

}
