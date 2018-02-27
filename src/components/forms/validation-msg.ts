import { Component, Input } from '@angular/core';

@Component({
    selector: 'msg',
    template: ''
})
export class ValidationMsg {
    constructor() {
    }

    @Input() name: string;
    @Input() value: string;
}
