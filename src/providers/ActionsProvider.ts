import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAction } from '../components/IAction';

@Injectable()
export class ActionsProvider {
    constructor() {
    }


    private actions: { [name: string]: IAction } = {};
    // private actions: { [name: string]: (params: any) => Observable<any> } = {};
    // private actions: Map<string, (params: any) => Observable<any>> = new Map();

    add(action: IAction) {
        this.actions[action.name] = action;
    }

    remove(name: string) {
        this.actions[name] = null;
    }

    get(name: string): IAction {
        return this.actions[name];
    }

    execute(name: string, params: any): Observable<any> {
        var action = this.actions[name];
        if (action) {
            return action.execute(params);
        }
        else {
            return Observable.empty();
        }
    }
}
