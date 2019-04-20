import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from './groceries-service.service';
import { min } from 'rxjs/operators';

@Injectable()
export class InputDialogService {

    constructor(private alertCtrl: AlertController, public groceriesService: GroceriesServiceService) {

    }

    async showPrompt(item?, index?) {
        const alert = await this.alertCtrl.create({
            subHeader: item ? 'Edit Item' : 'Add Item',
            message: item ? 'Please edit an item' : 'Please add an item.',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Name of item, e.g. "apples"',
                    value: item ? item.name : null
                },
                {
                    name: 'quantity',
                    type: 'number',
                    placeholder: 'Quantity to purchase',
                    value: item ? item.quantity : null
                }],
            buttons: [{
                text: 'save',
                handler: data => {
                    if (index !== undefined) {
                        item.name = data.name;
                        item.quantity = data.quantity
                        this.groceriesService.editItem(data, item._id);
                    } else {
                        this.groceriesService.addItem(data);
                    }
                }
            },
            {
                text: "Cancel"
            }]
        });

        alert.present();
    }
}