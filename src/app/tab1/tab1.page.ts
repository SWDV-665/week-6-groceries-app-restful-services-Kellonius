import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { GroceriesServiceService } from '../providers/groceries-service.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { isNgTemplate } from '@angular/compiler';
import { InputDialogService } from '../providers/input-dialog-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  items = [];
  errorMessage: string;
  
  constructor(public alertController: AlertController, public toastController: ToastController, 
    public groceriesService: GroceriesServiceService, private socialSharing: SocialSharing, private inputDialogService: InputDialogService) { 
      groceriesService.dataChanged$.subscribe((dataChanged: boolean) => {
        this.loadItems();
      })
      this.loadItems();
    }

  ionViewDidLoad() {
    this.loadItems();
  }
  toggle(item: any) {
    item.purchased = !item.purchased
  }

  loadItems() {
    this.groceriesService.getItems().subscribe(
      items => {this.items = items; console.log(items);},
      error => this.errorMessage = <any>error
    );
  }

  removeItem(id){
    this.groceriesService.removeItem(id);
  }

  async delete(item: any) {
    const toast = await this.toastController.create({
      message: "Removing item: " + item.name + ", " + item.quantity,
      duration: 3000
    })

    toast.present();
    this.groceriesService.removeItem(item);
  }

  addItem() {
   this.inputDialogService.showPrompt();
  }

  async editItem(item, index) {
    const toast = await this.toastController.create({
      message: 'Editing item - ' + index + "-" + item.name,
      duration: 3000
    })
    toast.present();
    this.inputDialogService.showPrompt(item, index);
  }

  async shareItem(item, index) {
    const toast = await this.toastController.create({
      message: 'Sharing item - ' + item.Name + "...",
      duration: 3000
    })
    toast.present();
    let message = "Grocery Item - Name: "+ item.name
    let subject = "Shared Via Groceries App."
    this.socialSharing.share(message, subject).then(() => {
      console.log('Shared successfully!')
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });
  }

}
