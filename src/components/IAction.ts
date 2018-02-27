import { Observable } from "rxjs/Observable";

export interface IAction {
    name: string;
    execute(params: any): Observable<any>;
}
