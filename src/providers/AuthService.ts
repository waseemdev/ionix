import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IoxAuthService {
    constructor() {
    }

    accessToken: string;
    authorizationHeader: string;

    getAuthHeader(): string {
        if (this.accessToken) {
            return `${this.authorizationHeader || 'Bearer'} ${this.accessToken}`;
        }
        return '';
    }
    
    authenticateAsync: () => Observable<boolean> = (): Observable<boolean> => {
        return new Observable(observer => {
            observer.next(true);
        });
    };
}
