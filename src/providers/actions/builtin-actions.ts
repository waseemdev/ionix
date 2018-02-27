import { IAction } from "../../components/IAction";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { App, ModalController, Modal, ToastController } from "ionic-angular";
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class PushViewAction implements IAction {
    name: string = 'pushView';

    constructor(private app: App) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.app.getActiveNavs()[0].push.apply(this.app.getActiveNavs()[0], params));
    }
}


@Injectable()
export class PopViewAction implements IAction {
    name: string = 'popView';

    constructor(private app: App) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.app.getActiveNavs()[0].pop.apply(this.app.getActiveNavs()[0], params));
    }
}


@Injectable()
export class SetRootViewAction implements IAction {
    name: string = 'setRootView';

    constructor(private app: App) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.app.getActiveNavs()[0].setRoot.apply(this.app.getActiveNavs()[0], params));
    }
}


@Injectable()
export class CloseViewAction implements IAction {
    name: string = 'closeView';

    constructor(private app: App) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.app.getActiveNavs()[0].getActive().dismiss.apply(this.app.getActiveNavs()[0].getActive(), params));
    }
}


@Injectable()
export class ShowModalAction implements IAction {
    name: string = 'showModal';

    constructor(private modalCtrl: ModalController) {
    }

    execute(params: any): Observable<any> {
        return new Observable(observer => {
            let modal: Modal = this.modalCtrl.create.apply(this.modalCtrl, params);
            modal.onDidDismiss(data => {
                observer.next(data);
                observer.complete();
            });
            modal.present().then(() => {
                // observer.next();
            });
        });
    }
}


@Injectable()
export class ShowToastAction implements IAction {
    name: string = 'showToast';

    constructor(private toastCtrl: ToastController) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.toastCtrl.create.apply(this.toastCtrl, params).present());
    }
}
