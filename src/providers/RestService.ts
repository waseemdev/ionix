import { Injectable } from '@angular/core';
import { IoxHttpService } from './HttpService';
import { Observable } from 'rxjs/Observable';
import { ApiComponent } from '../components/api';

// @dynamic
@Injectable()
export class IoxRestService {
    constructor() {
        if (!IoxRestService.singleton) {
            (IoxRestService as any).singleton = this;
        }
    }

    static readonly singleton: IoxRestService;


    private actions: { [name: string]: ApiComponent } = { };


    addAction(action: ApiComponent) {
        if (!action.url) {
            return console.error('action url must be provided!');
        }

        action.name = action.name || action.url;
        this.actions[action.name] = action;
    }

    getAction(name: string): ApiComponent {
        return this.actions[name];
    }
}
