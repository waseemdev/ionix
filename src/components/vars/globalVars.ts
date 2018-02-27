import { Directive } from '@angular/core';
import { IoxGlobalVarsService } from '../../providers/GlobalVars';

@Directive({
    selector: 'iox-global-vars'
})
export class IoxGlobalVars {
    constructor(private globalVarsService: IoxGlobalVarsService) {
    }

    get(name: string): any {
        return this.globalVarsService.get(name);
    }

    set(name: string, value: any) {
        this.globalVarsService.set(name, value);
    }
}
