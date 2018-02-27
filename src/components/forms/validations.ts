import { Component, OnInit, Host, ContentChildren, QueryList } from '@angular/core';
import { Input } from '@angular/core';
import { IoxFormComponent } from './form';
import { ControlBase } from './controlBase';
import { ValidationMsg } from './validation-msg';

@Component({
    selector: 'validations',
    template: `<p *ngFor="let e of errors" class="validation-error">{{e}}</p>`
})
export class ValidationsComponent extends ControlBase {
    constructor(@Host() form: IoxFormComponent) {
        super(form);
    }

    @ContentChildren(ValidationMsg) msgs: QueryList<ValidationMsg>;

    get errors(): any[] {
        var arr = [];
        if (this.control && this.control.touched && !this.control.valid) {
            arr = Object.keys(this.control.errors || {}).map(k => this.translate(k));
        }
        return arr;
    }

    private translate(k) {
        if (this.msgs && this.msgs.length) {
            let msg = this.msgs.find(m => m.name === k);
            return msg ? msg.value : k;
        }
        return k;
    }

    private _controlName : string;
    public get controlName() : string {
        return this._controlName;
    }
    @Input('control')
    public set controlName(v : string) {
        this._controlName = v;
        this.onFormGroupInit();
    }
}
