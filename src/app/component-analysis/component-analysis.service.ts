import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class ComponentAnalysisService {
    public service: Observable<any>;
    private headers: Headers = new Headers();
    
    constructor(
        private http: Http,
        private auth: AuthenticationService,
    ) {
        if (this.auth.getToken() !== null) {
            this.headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        }
    }

    isValid(component: any): boolean {
        return component.ecosystem && component.name && component.version;
    }

    getComponentAnalysis(component: any): Observable<any> {
        // let options = new RequestOptions({ headers: this.headers });
        if (!this.isValid(component)) return null;
        let url: string = `https://recommender.api.openshift.io/api/v1/component-analyses/${component.ecosystem}/${component.name}/${component.version}`;
        this.service = this    .http
                                .get(url, {
                                    headers: this.headers
                                })
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
