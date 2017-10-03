import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MockAuthenticationService } from '../shared/mock-auth.service';

@Injectable()

export class TypeAheadDependencyService {
    public service: Observable<any>;
    private headers: Headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    
    constructor(
        private http: Http,
        private auth: AuthenticationService,
        private stage: MockAuthenticationService
    ) {
        if (this.auth.getToken() !== null) {
            this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        }
        this.headers.set('Authorization', 'Bearer ' + this.stage.getStageToken());
    }

    getMatchingDependencies(searchKey: string): Observable<any> {
        let options = new RequestOptions({ headers: this.headers });
        let url: string = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/component-search/' + searchKey;
        this.service = this    .http
                                .get(url, options)
                                .map(this.extractData)
                                .catch(this.handleError);


        // let postData: any = {
        //     "ecosystem": "maven",
        //     "framework": "springboot or null",
        //     "version": "null or 1.2.1",
        //     "project": {
        //         "name": "project1",
        //         "description": "sample description",
        //         "options": {
        //             "group": "group name",
        //             "artifactId": "Id of artifact",
        //             "version": "vesion number"
        //         }
        //     },
        //     "dependencies": [
        //         "selected dependency 1",
        //         "selected dependency 2",
        //         "selected dependency 3"
        //     ]
        // };

        // let url: string = 'http://10.209.69.58:5000/generatefile';
        // this.headers.set('Accept', 'application/json');
        // let options = new RequestOptions({ headers: this.headers });
        // let body: any = JSON.stringify(postData);
        // this.service = this    .http
        //                         .post(url, body, options)
        //                         .map(this.extractData)
        //                         .catch(this.handleError);


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
