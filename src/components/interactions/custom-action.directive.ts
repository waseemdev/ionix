import { Renderer2, Directive, ElementRef, Input, Output, EventEmitter, ContentChildren, QueryList, ViewChild, ContentChild, Host, Optional, forwardRef } from '@angular/core';
import { CustomAction } from './custom-action';
import { Observable } from 'rxjs/Observable';
import { ActionBase } from 'ng-interactions';
import { ActionsProvider } from '../../providers';
import { IoxFormComponent } from '../forms';

@Directive({
    selector: '[action]',
    providers: [{provide: ActionBase, useExisting: forwardRef(() => CustomActionDirective) }]
})
export class CustomActionDirective extends CustomAction {
    constructor(element: ElementRef,
                renderer: Renderer2,
                actionsProvider: ActionsProvider,
                @Optional() @Host() form: IoxFormComponent) {
        super(element, renderer, actionsProvider, form);
    }
}
