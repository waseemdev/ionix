import { Directive } from '@angular/core';

@Directive({
    selector: 'iox-local-vars'
})
export class IoxLocalVars {
    constructor() {
    }

    ngOnDestroy() {
    }

    private vars = {};

    get(name: string): any {
        return this.vars[name];
    }

    set(name: string, value: any) {
        this.vars[name] = value;
    }
}
