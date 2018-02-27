import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpResponse, HttpParams, HttpEventType } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { IoxAuthService } from "./AuthService";
import { IoxHttpOptions } from "./HttpOptions";

@Injectable()
export class IoxHttpService {
    constructor(private http: HttpClient,
                private authService: IoxAuthService,
                private httpOptions: IoxHttpOptions) {
    }


    liveRequests: number = 0;
    succeededRequests: number = 0;
    failedRequests: number = 0;
    iterceptRequest: (httpRequest: HttpRequest<any>) => boolean;


    private getBaseUrl() {
        if (this.httpOptions.apiBasePath) {
            return this.httpOptions.apiBasePath;
        }
        return '';
    }

    private prepareUrl(url: string): string {
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
            return url;
        }

        if (url.indexOf('~/') === 0) {
            url = url.substr(1);
        }
        else {
            url = this.getBaseUrl() + url;
        }

        url = (this.httpOptions.domain ? this.httpOptions.domain : '') + url;
        return url;
    }

    public get<T>(url: string, options?: any): Observable<T> {
        return this.request('GET', url, null, options);
    }

    public post<T>(url: string, body: string, options?: any): Observable<T> {
        return this.request('POST', url, body, options);
    }

    public put<T>(url: string, body: string, options?: any): Observable<T> {
        return this.request('PUT', url, body, options);
    }

    public delete<T>(url: string, options?: any): Observable<T> {
        return this.request('DELETE', url, null, options);
    }

    public patch<T>(url: string, body: string, options?: any): Observable<T> {
        return this.request('PATCH', url, body, options);
    }

    public head<T>(url: string, options?: any): Observable<T> {
        return this.request('HEAD', url, null, options);
    }

    private request<T>(method: string, url: string, body: string, options?: any): Observable<T> {
        var anonymous: boolean = options && options.anonymous;
        if (anonymous) {
            return this._request(method, url, body, options);
        }
        return this._authorizedRequest(method, url, body, options);
    }

    private _request<T>(method: any, url: string, body?: string, options?: any): Observable<T> {
        this.liveRequests++;
        url = this.prepareUrl(url);
        var headers: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (!options || options && !options.anonymous) {
            headers = headers.append("Authorization", this.authService.getAuthHeader());
        }

        options = Object.assign({
            headers: headers,
            reportProgress: false,
            responseType: 'json',
            withCredentials: false
        }, options);

        let request = new HttpRequest(method, url, body, options);
        if (this.iterceptRequest) {
            if (!this.iterceptRequest(request)) {
                return new Observable(observer => {
                    observer.next();
                    observer.complete();
                });
            }
        }

        return new Observable<T>((observer) => {
            this.http.request<T>(request)
                .subscribe((res) => {
                    if (res.type === HttpEventType.Response) {
                        this.liveRequests--;
                        this.succeededRequests++;
                        observer.next((res as HttpResponse<T>).body);
                        observer.complete();
                    }
                },
                (err) => {
                    this.liveRequests--;
                    this.failedRequests++;
                    switch (err.status) {
                        case 401:
                            //intercept 401
                            //   this.authFailed.next(err);
                            observer.error(err);
                        break;
                        default:
                            observer.error(err);
                        break;
                    }
                })
            });
    }

    private _authorizedRequest<T>(method: any, url: string, body?: string, options?: any): Observable<T> {
        return new Observable<T>(observer => {
            this.authService.authenticateAsync().subscribe(result => {
                if (result) {
                    this._request.apply(this, [method, url, body, options])
                    .subscribe((res) => {
                        observer.next(res);
                        observer.complete();
                    }, (error) => {
                        observer.error(error);
                    });
                }
                return null;
            }, (error) => {
                observer.error(error);
            });
        });
    }
}
