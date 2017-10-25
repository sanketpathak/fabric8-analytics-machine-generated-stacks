import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
//import 'rxjs/add/Observable/throw';

@Injectable()

export class ProjectGenerationService {
    public service: Observable<any>;
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private http: Http,
        private auth: AuthenticationService,
    ) {
        if (this.auth.getToken() !== null) {
            this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        }
    }

    postJSON(data: any) {

        this.headers.set('Accept', 'multipart/form-data');
        let options = new RequestOptions({ headers: this.headers });
        let body: any = JSON.stringify(data);
        let url: string = 'http://generate-manifest-generate-manifest.dev.rdu2c.fabric8.io/generatefile';
        this.service = this     .http
                                .post(url, body, options)
                                .map((response: any) => {
                                    console.log(response);
                                    let blob = new Blob([response._body], { type: 'application/download' });
                                    let url: any = window.URL.createObjectURL(blob);
                                    let a: any = document.createElement('a');
                                    
                                    a.href = url;
                                    a.download = 'pom.xml';
                                    document.body.appendChild(a);
                                    a.click();
                                })
                                .catch(this.handleError);

        return this.service;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
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
