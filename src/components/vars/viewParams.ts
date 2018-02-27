import { Directive,Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({ selector: 'iox-view-params', template: '' })
export class IoxViewParamsDirective {
    constructor(private navParams: NavParams) {
    }

    get(name: string): any {
        return this.navParams.get(name);
    }
}
