import { Injectable } from '@angular/core';

// @dynamic
@Injectable()
export class IoxStorageService {
    constructor() {
    }

    private static cache = {};

    get(name: string): any {
        return IoxStorageService.cache[name] || (IoxStorageService.cache[name] = localStorage.getItem(name));
    }

    getJSON(name: string): any {
        if (IoxStorageService.cache[name]) {
            return IoxStorageService.cache[name];
        }

        let val = localStorage.getItem(name);
        if (val) {
            return (IoxStorageService.cache[name] = JSON.parse(val));
        }
        return null;
    }

    set(name: string, value: any) {
        IoxStorageService.cache[name] = value;
        localStorage.setItem(name, value + '');
    }

    setJSON(name: string, value: any) {
        IoxStorageService.cache[name] = value;
        localStorage.setItem(name, JSON.stringify(value));
    }

    remove(name: string) {
        localStorage.removeItem(name);
        delete IoxStorageService.cache[name];
    }
}
