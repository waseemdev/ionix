import { Renderer2, ElementRef, Input, Output, EventEmitter, ContentChild, Host, Optional, Component, forwardRef } from '@angular/core';
import { Refresher, InfiniteScroll, List } from 'ionic-angular';
import { ApiComponent } from '../api';
import { IoxFormComponent } from '../forms/form';
import { Observable } from 'rxjs/Observable';
import { ActionBase } from 'ng-interactions';
import { ActionsProvider } from '../../providers';
import { IAction } from '../IAction';

// @Component: to be able to be added to declaration in NgModule,
// And why should you add it to NgModule in the first place?
// To avoid an error in AOT mode, see: https://github.com/angular/angular/issues/13590 and good lock with that!
@Component({
    selector: '[action-base]',
    template: '',
    providers: [{provide: ActionBase, useExisting: forwardRef(() => CustomAction) }]
})
export abstract class CustomAction extends ActionBase implements IAction {
    constructor(protected element: ElementRef,
                private renderer: Renderer2,
                private actionsProvider: ActionsProvider,
                @Optional() @Host() protected form: IoxFormComponent) {
        super();
    }

    @ContentChild(Refresher) ionRefresher: Refresher;
    @ContentChild(InfiniteScroll) ionInfiniteScroll: InfiniteScroll;
    @ContentChild(List) ionList: List;

    private subscriptions: any[] = [];
    private canDisabled: boolean = false;
    private hasForm: boolean = false;

    execute(params: any): Observable<any> {
        return super.execute(params);
    }

    ngOnInit() {
        let autoload = false;
        switch (this.element.nativeElement.localName) {
            case 'ion-content':
                autoload = true;
            break;

            case 'ion-refresher':
            break;

            case 'ion-infinite-scroll':
            break;

            case 'ion-list':
                if (this.action instanceof ApiComponent) {
                    this.reloadApi();
                }
            break;

            // case 'a':
            // case 'button':
            default:
                if (['actions', 'action'].indexOf(this.element.nativeElement.localName) < 0) {
                    // this.canDisabled = true;
                    (this.element.nativeElement as HTMLElement).addEventListener('click', this.onExecuteAction.bind(this));
                }
            break;
        }

        if (this.action instanceof ApiComponent) {
            if (this.ionRefresher) {
                let sb = this.ionRefresher.ionRefresh.subscribe(() => {
                    this.doRefresh(this.ionRefresher);
                });
                this.subscriptions.push(sb);
            }
            if (this.ionInfiniteScroll) {
                let sb = this.ionInfiniteScroll.ionInfinite.subscribe(() => {
                    this.getNextPage(this.ionInfiniteScroll);
                });
                this.subscriptions.push(sb);
            }

            // autoload data
            if (this.element.nativeElement.parentElement.localName !== 'actions' &&
                ['button', 'a'].findIndex(a => a === this.element.nativeElement.localName) < 0 || autoload) {
                this.reloadApi();
            }
        }
    }

    private reloadApi(showLoadingMsg?): Observable<any> {
        let { data, queryParams } = this.extractDataAndQueryParams();
        return (this.action as ApiComponent).reloadData(data, queryParams, showLoadingMsg);
    }

    private doRefresh(refresher) {
        if (!this.action || !(this.action instanceof ApiComponent)) {
            return refresher.complete();
        }

        this.reloadApi(false).subscribe(res => {
            refresher.complete();
        }, err => { refresher.complete(); });
    }

    getNextPage(infiniteScroll) {
        if (!this.action || !(this.action instanceof ApiComponent) || !(this.action as ApiComponent).hasNextPage) {
            return infiniteScroll.complete();
        }

        let { data, queryParams } = this.extractDataAndQueryParams();
        (this.action as ApiComponent).loadNextPage(data, queryParams).subscribe(res => {
            infiniteScroll.complete();
        }, err => { infiniteScroll.complete(); });
    }

    ngOnDestroy() {
        switch (this.element.nativeElement.localName) {
            case 'ion-refresher':
            break;
            case 'ion-infinite-scroll':
            break;
            case 'ion-list':
            break;

            // case 'a':
            // case 'button':
            default:
                if (['actions', 'action'].indexOf(this.element.nativeElement.localName) < 0) {
                    (this.element.nativeElement as HTMLElement).removeEventListener('click', this.onExecuteAction.bind(this));
                }
            break;
        }
        this.subscriptions.forEach(sb => sb && sb.unsubscribe && sb.unsubscribe());
        // if (this.name) {
        //     this.actionsProvider.remove(this.name);
        // }
    }

    private canClick = true;
    protected onExecuteAction(event) {
        if (!this.canClick) {
            return;
        }
        this.canClick = false;
        setTimeout(() => {
            this.canClick = true;
        }, 300);

        this.disableButton(true);
        this.executeInternal({ $event: event })
            .subscribe((res) => {
                this.disableButton(this.hasForm);
                this.done.emit(res);
            }, (err) => {
                this.disableButton(false);
                this.done.emit(err);
            });
    }

    protected executeInternal(params: any): Observable<any> {
        // if (this.ref) {
        //     return this.actionsProvider.execute(this.ref, params);
        // }
        return this.executeAction(params);
    }

    executeAction(params: any): Observable<any> {
        if (typeof this.action === 'string') {
            if (this.action === 'submitForm') {
                this.disableButton(true);
                return this.submitForm();
            }
            else {
                return this.actionsProvider.execute(this.action, this.params as any[]);
            }
        }
        else if (this.action instanceof ApiComponent) {
            let { data, queryParams, ioxForm } = this.extractDataAndQueryParams();

            return this.action.execute(data, queryParams);
        }
        else if (this.action instanceof CustomAction) {
            this.action.params = this.params || this.action.params;
            return this.action.executeInternal(params);
        }
    }

    private extractDataAndQueryParams(): { data: any, queryParams: any, ioxForm: IoxFormComponent } {
        let data;
        let queryParams;
        let ioxForm: IoxFormComponent = this.form;

        let ioxFormIndex = this.getIoxFormParamIndex();
        if (ioxFormIndex > -1) {
            ioxForm = this.params[ioxFormIndex];
        }

        if (ioxForm) {
            if (this.params) {
                if (this.params[ioxFormIndex + 1] === true) {
                   data = ioxForm.getChanges(this.params[ioxFormIndex + 2]);
                }
                else {
                    data = ioxForm.getValue(this.params[ioxFormIndex + 2]);
                }
                queryParams = (this.params as any[]).slice(ioxFormIndex + 1);
            }
            else {
                data = ioxForm.getValue();
            }
        }
        else {
            queryParams = this.params;
        }

        return { data, queryParams, ioxForm };
    }

    private getIoxFormParamIndex(): number {
        if (!this.params || typeof this.params === 'string') {
            return -1;
        }
        return this.params.findIndex(a => a.formGroup);
    }

    private submitForm(): Observable<any> {
        let { data, queryParams, ioxForm } = this.extractDataAndQueryParams();
        if (ioxForm) {
            this.hasForm = true;
            return ioxForm.submit(data, queryParams);
        }
        else {
            return Observable.empty();
        }
    }

    private bindDisabledProp() {
        if (typeof this.action === 'string') {
            if (this.action === 'submitForm' && this.form) {
                this.bindFormEvents(this.form);
                this.canDisabled = ['action', 'actions'].findIndex(a => a === this.element.nativeElement.localName) < 0;
                this.disableButton(true);
            }
        }
        else if (this.action instanceof ApiComponent) {
            let ioxForm: IoxFormComponent;
            let ioxFormIndex = this.getIoxFormParamIndex();
            if (ioxFormIndex > -1) {
                ioxForm = this.params[ioxFormIndex];
                this.bindFormEvents(ioxForm);
            }
        }
    }

    private bindFormEvents(ioxForm: IoxFormComponent) {
        // ioxForm.onValueChanges((formGroup) => { this.disableButton(!formGroup.valid && formGroup.dirty); });
        ioxForm.onStateChanges((formGroup) => { this.disableButton(!formGroup.valid && formGroup.dirty); });
    }

    private disableButton(value: boolean) {
        if (!this.canDisabled) {
            return;
        }
        if (value) {
            this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'disabled');
        }
        else {
            this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
        }
    }


    private _name : string;
    public get name() : string {
        return this._name;
    }
    @Input()
    public set name(v : string) {
        if (v !== this._name) {
            if (this._name) {
                this.actionsProvider.remove(v);
            }
            this._name = v;
            if (this._name) {
                this.actionsProvider.add(this);
            }
        }
    }


    // private _ref : string;
    // public get ref() : string {
    //     return this._ref;
    // }
    // @Input()
    // public set ref(v : string) {
    //     if (v !== this._ref) {
    //         if (this._ref) {
    //         }
    //         this._ref = v;
    //         if (this._ref) {
    //             // this.actionsProvider.add(this._ref, (params, done) => {
    //             //     this.executeInternal(params);
    //             //     done.emit();
    //             // });
    //         }
    //     }
    // }



    private _action : string | ApiComponent | CustomAction;
    public get action() : string | ApiComponent | CustomAction {
        return this._action;
    }
    @Input('action')
    public set action(v : string | ApiComponent | CustomAction) {
        this._action = v;
        this.bindDisabledProp();
    }


    private _params : any[] | string;
    public get params() : any[] | string {
        return this._params;
    }
    @Input('actionParams')
    public set params(v : any[] | string) {
        this._params = v;
        this.bindDisabledProp();
    }

    @Output() done: EventEmitter<any> = new EventEmitter();
}
