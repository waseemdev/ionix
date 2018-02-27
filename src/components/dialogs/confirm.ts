import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { DialogBase } from './dialog-base';

@Component({
    selector: 'iox-confirm',
    template: ''
})
export class IoxConfirm extends DialogBase {
    constructor(private alertCtrl: AlertController) {
        super();
    }

    @Input() title: string;
    @Input() yesText: string;
    @Input() noText: string;

    @Output() confirmed: EventEmitter<any> = new EventEmitter();
    @Output() cancelled: EventEmitter<any> = new EventEmitter();


    protected presentInternal(params?: any) {
        let alert = this.alertCtrl.create({
            title: this.title,
            message: this.message,
            buttons: [
                {
                    text: this.noText,
                    role: 'cancel',
                    handler: () => {
                        this.cancelled.emit(params);
                    }
                },
                {
                    text: this.yesText,
                    handler: () => {
                        this.confirmed.emit(params);
                    }
                }
            ]
        });
        alert.present();
    }
}
