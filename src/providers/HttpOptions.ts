import { Injectable } from '@angular/core';

@Injectable()
export class IoxHttpOptions {
    constructor() {
    }

    domain: string;
    apiBasePath: string;
}
