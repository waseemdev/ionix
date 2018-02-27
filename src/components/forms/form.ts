import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldDefComponent } from './field-def';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ApiComponent } from '../api';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { GroupDefComponent } from './group-def';

@Component({
    selector: 'iox-form',
    template: `
<form [formGroup]="formGroup" *ngIf="formGroup">
    <ng-content *ngIf="formGroup"></ng-content>
</form>`
})
export class IoxFormComponent {
    constructor(private formBuilder: FormBuilder,
                private toastCtrl: ToastController) {
    }

    @ContentChildren(FieldDefComponent) fieldDefs: QueryList<FieldDefComponent>;
    @ContentChildren(GroupDefComponent) groupDefs: QueryList<GroupDefComponent>;
    @Input() submitAction: ApiComponent;
    @Input() submitParams: any[];
    @Input() validationMessage: string;
    formGroup: FormGroup;
    formGroupCreated: EventEmitter<any> = new EventEmitter();

    private subscriptions: any[] = [];
    private originalValue;


    private _initialValue : any;
    public get initialValue() : any {
        return this._initialValue;
    }
    @Input()
    public set initialValue(v : any) {
        this._initialValue = v;
        if (v) {
            this.reset(v);
        }
    }


    ngAfterViewInit() {
        var controls = {};

        this.initFields(controls, this.fieldDefs);
        this.initGroups(controls, this.groupDefs);

        this.formGroup = this.formBuilder.group(controls);
        this.formGroupCreated.emit();
    }

    private initFields(controls: any, fieldDefs: QueryList<FieldDefComponent>) {
        if (!fieldDefs) {
            return;
        }
        fieldDefs.forEach((f, i) => {
            let arr = [f.default];
            let validators = this.getValidators(f);
            if (validators && validators.length) {
                arr = [...arr, validators];
            }
            controls[f.name] = arr;
        });
    }

    private initGroups(controls: any, groupDefs: QueryList<GroupDefComponent>) {
        if (!groupDefs) {
            return;
        }
        groupDefs.forEach((g, i) => {
            let group = {};
            this.initFields(group, g.fieldDefs);
            if (g.array) {
                controls[g.name] = this.formBuilder.array([group]);
            }
            else {
                controls[g.name] = this.formBuilder.group(group);
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s && s.unsubscribe && s.unsubscribe());
    }

    getControl(name: string): any {
        return this.formGroup ? this.formGroup.controls[name] : null;
    }

    getControlValue(name: string): any {
        return this.formGroup && this.formGroup.controls[name] ? this.formGroup.controls[name].value : null;
    }

    commitChanges() {
        this.reset(this.formGroup.value);
    }

    cancelChanges() {
        this.reset(this.originalValue);
    }

    reset(value) {
        this.formGroup.reset(value);
        this.originalValue = value;
    }

    submit(data?: any, queryParams?: any[]): Observable<any> {
        if (!this.submitAction) {
            return Observable.empty();
        }

        queryParams = queryParams || this.submitParams || [];
        data = data || this.getData(queryParams);

        if (!this.validate(data)) {
            if (this.validationMessage) {
                this.toastCtrl.create({ message: this.validationMessage, duration: 3000 }).present();
            }
            return Observable.empty();
        }

        var share = this.submitAction.execute(data, queryParams.slice(2));
        share.subscribe(() => {
            this.commitChanges();
        }, () => {
        });
        return share;
    }

    private getData(queryParams: any[]) {
        let data;
        if (queryParams[1] === true) {
            data = this.getChanges(queryParams[2]);
        }
        else {
            data = this.getValue(queryParams[2]);
        }
        return data;
    }

    private getValidators(field: FieldDefComponent): any[] {
        var res = [];
        if (field.required) {
            res.push(Validators.required);
        }
        if (field.maxLength) {
            res.push(Validators.maxLength(field.maxLength));
        }
        if (field.minLength) {
            res.push(Validators.minLength(field.minLength));
        }
        if (field.max) {
            res.push(Validators.max(field.max));
        }
        if (field.min) {
            res.push(Validators.min(field.min));
        }
        if (field.regex) {
            res.push(Validators.pattern(field.regex));
        }
        return res;
    }

    private validate(keys: {}) : boolean {
        for (var i in this.formGroup.controls) {
            if (!keys || i in keys) {
                this.formGroup.controls[i].markAsTouched();
            }
        }

        var res = true;
        if (keys) {
            for (var i in this.formGroup.controls) {
                if (i in keys) {
                    res = res && this.formGroup.controls[i].valid;
                }
            }
        }
        else {
            res = this.formGroup.valid;
        }

        // if (!res) {
        //     this.toastCtrl.create({ message: this.translate.instant('FORM_FIELDS_REQUIRED'), duration: 3000 }).present();
        // }

        return res;
    }

    onStateChanges(callback: (formGroup: FormGroup) => void) {
        this.onFormGroupCreated(() => {
            this.subscriptions.push(this.formGroup.statusChanges.subscribe(() => {
                callback && callback(this.formGroup);
            }));
        });
    }

    onValueChanges(callback: (formGroup: FormGroup) => void) {
        this.onFormGroupCreated(() => {
            this.subscriptions.push(this.formGroup.valueChanges.subscribe(() => {
                callback && callback(this.formGroup);
            }));
        });
    }

    onFormGroupCreated(callback) {
        this.subscriptions.push(this.formGroupCreated.subscribe(() => {
            callback && callback(this.formGroup);
        }));
        if (this.formGroup) {
            callback && callback(this.formGroup);
        }
    }

    getValue(tag?: string): any {
        let value = {};

        this.iterateFields(tag, (control, field) => {
            value[field.name] = control.value;
        });

        return value;
    }

    getChanges(tag?: string): any {
        let value = {};

        this.iterateFields(tag, (control, field) => {
            if (control.dirty) {
                value[field.name] = control.value;
            }
        });

        return value;
    }

    private iterateFields(tag: string, itemCallback: (control, field) => void): any {
        let not = tag ? tag[0] === '!' : false;
        tag = tag ? tag.split('!')[1] : tag;

        for (let cn in this.formGroup.controls) {
            var field = this.fieldDefs.find(f => f.name === cn);
            if (field && (!tag || !not && field.tag === tag || not && field.tag !== tag)) {
                let c = this.formGroup.controls[cn];
                itemCallback && itemCallback(c, field);
            }
        }
    }
}
