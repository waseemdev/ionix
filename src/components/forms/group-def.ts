import { Component, OnInit, Input, ContentChildren, QueryList } from '@angular/core';
import { FieldDefComponent } from './field-def';

@Component({
    selector: 'group-def',
    template: '',
    styles: [`group-def { display: none; }`]
})
export class GroupDefComponent {
    constructor() { }

    @Input() name: string;
    @Input() array: boolean;
    @ContentChildren(FieldDefComponent) fieldDefs: QueryList<FieldDefComponent>;
}
