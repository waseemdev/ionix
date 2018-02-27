import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, EventEmitter, Output } from "@angular/core";
import { IoxHttpService } from '../../providers/HttpService';
import { Loading, LoadingController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { IoxStorageService } from '../../providers';

@Component({
    selector: 'api',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ApiComponent {
    @Input() name: string;
    @Input() method: string;
    @Input() url: string;

    @Input() authorized: boolean;
    @Input() anonymous: boolean;

    @Input() executingMessage: string;
    @Input() successMessage: string;
    @Input() errorMessage: string | { [name: string]: string };

    @Input() startPageNo: number = 1;
    @Input() pagingQueryParam: string;
    // @Input() pagingBodyParam: string;
    @Input() hasNextPage: boolean = true;

    @Input() dataPath: string;
    @Input() cache: boolean;
    @Input() persistDataKey: string;

    @Output() onError: EventEmitter<any> = new EventEmitter();
    @Output() onSuccess: EventEmitter<any> = new EventEmitter();

    currentPage: number = 0;

    private _response: any;
    get response() : any {
        return this._response;
    }

    private _data: any;
    get data() : any {
        return this._data;
    }

    private _error: any;
    get error() : any {
        return this._error;
    }

    private _executing : boolean;
    get executing() : boolean {
        return this._executing;
    }


    constructor(private http: IoxHttpService,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private storageService: IoxStorageService) {
    }



    reloadData(data, queryParams, showLoadingMsg: boolean = true): Observable<any> {
        this.currentPage = this.startPageNo;
        return this.execute(data, queryParams, showLoadingMsg);
    }

    loadNextPage(data, queryParams, showLoadingMsg: boolean = true): Observable<any> {
        if (!this.hasNextPage) {
            return Observable.empty();
        }

        this.currentPage++;
        return this.execute(data, queryParams, false);
    }

    execute(data?, queryParams?, showLoadingMsg: boolean = true): Observable<any> {
        let method = (this.method || 'get').toLowerCase();
        let func = this.http[method];
        if (!func) {
            return Observable.empty();
        }

        this._executing = true;

        if (this.cache && this.response) {
            return new Observable((observer) => {
                observer.next(this.data);
                observer.complete();
                this._executing = false;
            });
        }

        let args;
        let options = { anonymous: this.anonymous || this.authorized !== true };
        if (method === 'delete' || method === 'head') {
            args = [options];
        }
        else if (method === 'get') {
            if (this.pagingQueryParam) {
                args = [options];
            }
            // else if (this.pagingBodyParam) {
            //     // todo: args = [body, options];
            //     args = [options];
            // }
            else {
                args = [options];
            }
        }
        else {
            let body = JSON.stringify(data);
            args = [body, options];
        }

        let url = this.composeQueryParams(queryParams);

        let loading: Loading;
        if (showLoadingMsg && this.executingMessage !== null && this.executingMessage !== undefined) {
            loading = this.loadingCtrl.create({
                content: this.executingMessage
            });
            loading.present();
        }

        let share = func.apply(this.http, [/*this.name,*/ url, ...args]).share();
        share.map(res => {
                this._response = res;
                this._data = this.map(res, this.dataPath);
                if (this.persistDataKey) {
                    this.storageService.setJSON(this.persistDataKey, this.data);
                }
                return this.data;
            })
            .subscribe(res => {
                if (loading) {
                    loading.dismiss();
                }

                let success = true;
                if (success && this.successMessage) {
                    this.toastCtrl.create({ message: this.successMessage, duration: 3000 }).present();
                }
                if (!success && this.errorMessage) {
                    this.showErrorMessage();
                }

                this.onSuccess.emit(res);
                this._executing = false;
            }, error => {
                this._error = error;
                if (loading) {
                    loading.dismiss();
                }
                if (this.errorMessage) {
                    this.showErrorMessage();
                }
                this.onError.emit(error);
                this._executing = false;
            });
        return share;
    }

    private showErrorMessage() {
        let msg = '';
        if (typeof this.errorMessage === 'string') {
            msg = this.errorMessage;
        }
        // else {
        //     msg = this.errorMessage[''];
        // }
        this.toastCtrl.create({ message: msg, duration: 3000 }).present();
    }

    private composeQueryParams(queryParams): string {
        let url = this.url;

        if (this.pagingQueryParam) {
            if (url.indexOf('?') < 0) {
                url += '?';
            }
            else {
                url += '&';
            }
            url += `${this.pagingQueryParam}=${this.currentPage}`;
        }

        if (queryParams) {
            if (queryParams instanceof Array) {
                url = this.replaceParamsByIndex(url, queryParams);
            }
            else {
                url = this.replaceParamsByName(url, queryParams);
            }
        }

        return url;
    }

    private replaceParamsByIndex(url: string, params: any[]): string {
        let pi = 0;
        let result = url.replace(/(\{)(.*?)(\})/ig, (part, p1, word, p2) => {
            let p = params[pi];
            if (typeof p === 'object') {
                return part;
            }
            pi++;
            return p;
        });

        for (let i = 0; i < params.length; i++) {
            const p = params[i];
            if (typeof p === 'object') {
                result = this.replaceParamsByName(result, p);
            }
        }
        return result;
    }

    private replaceParamsByName(url: string, params: {}): string {
        Object.keys(params).forEach(a => {
            var value = params[a];
            url = url.replace(`{${a}}`, value);
        });
        return url;
    }

    map(result: any, path: string): any {
        var mappedResult = result;
        if (!path) {
            return mappedResult;
        }

        var paths = path.split('.');
        paths.forEach(p => p && mappedResult && (mappedResult = mappedResult[p]));

        return mappedResult;
    }
}
