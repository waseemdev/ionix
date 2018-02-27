import { Renderer2, Component, ElementRef, Input, Output, EventEmitter, ContentChildren, QueryList, ViewChild, ContentChild, Host, Optional, forwardRef } from '@angular/core';
import { CustomAction } from './custom-action';
import { Observable } from 'rxjs/Observable';
import { ActionBase } from 'ng-interactions';
import { ActionsProvider } from '../../providers';
import { IoxFormComponent } from '../forms';

@Component({
    selector: 'action',
    template: ''
})
export class CustomActionComponent {
    constructor() {
    }
}
