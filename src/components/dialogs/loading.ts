import { Component, Input } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { DialogBase } from './dialog-base';

@Component({
    selector: 'iox-loading',
    template: ''
})
export class IoxLoading extends DialogBase {
    constructor(private loadingCtrl: LoadingController) {
        super();
    }

    @Input() duration: number;
    private loading;

    protected presentInternal(params?: any) {
        this.loading = this.loadingCtrl.create({
            content: this.message,
            duration: this.duration
        });
        this.loading.present(params);
    }

    dismiss() {
        this.loading && this.loading.dismiss();
    }
}
