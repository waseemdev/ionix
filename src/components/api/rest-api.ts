import { Component, QueryList, ContentChildren } from '@angular/core';
import { ApiComponent } from './api';
import { IoxRestService } from '../../providers/RestService';

@Component({
    selector: 'iox-apis',
    template: ''
})
export class IoxRestApiContainer {
    constructor(private restService: IoxRestService) {
    }

    @ContentChildren(ApiComponent) actionsComponents: QueryList<ApiComponent>;

    ngAfterViewInit() {
        this.actionsComponents.forEach((item, i) => {
            this.restService.addAction(item);
        });
    }
}
