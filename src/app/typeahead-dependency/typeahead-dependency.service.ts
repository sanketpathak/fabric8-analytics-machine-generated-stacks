import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class TypeAheadDependencyService {
    public service: Observable<any>;
    constructor(private http: Http) {}

    getMatchingDependencies(searchKey: string): Observable<any> {
        let url: string = '';
        let body: any = JSON.stringify({
            search: searchKey
        });
        this.service = this    .http
                                .get(url, body)
                                .map(this.extractData)
                                .catch(this.handleError);

        return this.service;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
