import { Injectable } from '@angular/core';

// @dynamic
@Injectable()
export class IoxGlobalVarsService {
    constructor() {
    }

    private static vars = {};

    get(name: string): any {
        return IoxGlobalVarsService.vars[name];
    }

    set(name: string, value: any) {
        IoxGlobalVarsService.vars[name] = value;
    }
}
