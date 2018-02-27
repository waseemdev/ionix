import { NgModule, ModuleWithProviders } from '@angular/core';
import { components } from './components';
import { providers, PopViewAction, PushViewAction, CloseViewAction, ShowModalAction, ShowToastAction, SetRootViewAction, ActionsProvider } from './providers';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgInteractionsModule } from 'ng-interactions';

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgInteractionsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgInteractionsModule,
        ...components
    ]
})
export class IoxModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IoxModule,
            providers: providers
        };
    }

    constructor(popView: PopViewAction,
                pushView: PushViewAction,
                setRoot: SetRootViewAction,
                closeView: CloseViewAction,
                showModal: ShowModalAction,
                showToast: ShowToastAction,
                actionsProvider: ActionsProvider) {
        actionsProvider.add(popView);
        actionsProvider.add(pushView);
        actionsProvider.add(setRoot);
        actionsProvider.add(closeView);
        actionsProvider.add(showModal);
        actionsProvider.add(showToast);
    }
}
