import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
    selector: 'iox-dialog-base',
    template: ''
})
export abstract class DialogBase {
    constructor() {
    }

    @Input() message: string;

    private _showOn : any;
    public get showOn() : any {
        return this._showOn;
    }
    @Input()
    public set showOn(v : any) {
        this._showOn = v;
        if (v) {
            this.present();
        }
    }


    private canClick = true;
    present(params?: any) {
        if (!this.canClick) {
            return;
        }
        this.canClick = false;
        setTimeout(() => {
            this.canClick = true;
        }, 500);
        
        this.presentInternal(params);
    }

    protected presentInternal(params?: any) {
    }
}
