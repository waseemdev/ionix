import { Directive } from '@angular/core';
import { IoxStorageService } from '../../providers';

@Directive({ selector: 'iox-storage' })
export class IoxStorage {
    constructor(private storageService: IoxStorageService) {
    }


    get(name: string): any {
        return this.storageService.get(name);
    }

    getJSON(name: string): any {
        return this.storageService.getJSON(name);
    }

    set(name: string, value: any) {
        this.storageService.set(name, value);
    }

    setJSON(name: string, value: any) {
        this.storageService.setJSON(name, value);
    }

    remove(name: string) {
        this.storageService.remove(name);
    }
}
