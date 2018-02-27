import { Directive, OnInit, ElementRef, Host, HostBinding } from '@angular/core';
import { Input } from '@angular/core';
import { IoxFormComponent } from './form';
import { FormControl } from '@angular/forms';

export abstract class ControlBase {
    constructor(private form: IoxFormComponent) {
        form.onFormGroupCreated(() => {
            this.onFormGroupInit();
        });
    }

    protected onFormGroupInit() {
        if (this.form.formGroup && this.controlName) {
            this.control = this.form.formGroup.controls[this.controlName] as any;
            this.onControlInit();
        }
    }

    protected onControlInit() {

    }

    protected control: FormControl;
    controlName: string;
}
