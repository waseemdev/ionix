import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'field-def',
    template: '',
    styles: [`field-def { display: none; }`]
})

export class FieldDefComponent {
    constructor() { }

    @Input() name: string;
    @Input() tag: string;
    @Input() default: any;
    @Input() required: boolean;
    @Input() regex: string;
    @Input() max: number;
    @Input() min: number;
    @Input() maxLength: number;
    @Input() minLength: number;
}
