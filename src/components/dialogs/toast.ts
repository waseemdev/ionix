import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { DialogBase } from './dialog-base';

@Component({
    selector: 'iox-toast',
    template: ''
})
export class IoxToast extends DialogBase {
    constructor(private toastCtrl: ToastController) {
        super();
    }

    @Input() duration: number = 3000;

    protected presentInternal(params?: any) {
        this.toastCtrl.create({ message: this.message, duration: this.duration }).present(params);
    }
}
