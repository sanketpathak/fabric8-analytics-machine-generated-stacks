import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

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

    getComponentAnalysis(component: any): Observable<any> {
        let options = new RequestOptions({ headers: this.headers });
        let url: string = `https://recommender.api.openshift.io/api/v1/component-analyses/${component.ecosystem}/${component.name}/${component.version}`;
        this.service = this    .http
                                .get(url, options)
                                .map(this.extractData)
                                .catch(this.handleError);

        return this.service;
    }

    testRoute(): void {
        let url: string = 'http://10.209.69.58:5000/test';
        let body: any = JSON.stringify({'name': 'Some Name'});
        
        let options = new RequestOptions({ headers: this.headers });
        this.service = this     .http
                                .post(url, body, options)
                                .map((response: Response) => {
                                    console.log(response);
                                    var blob = new Blob([response], { type: 'text/xml' });
                                    var url= window.URL.createObjectURL(blob);
                                    window.open(url);
                                })
                                .catch(this.handleError);

    }

    postJSON() {
        let postData: any = {
            "ecosystem": "maven",
            "framework": "springboot or null",
            "version": "null or 1.2.1",
            "project": {
                "name": "project1",
                "description": "sample description",
                "options": {
                    "group": "group name",
                    "artifactId": "Id of artifact",
                    "version": "vesion number"
                }
            },
            "dependencies": [
                "selected dependency 1",
                "selected dependency 2",
                "selected dependency 3"
            ]
        };
        
        this.headers.set('Accept', 'multipart/form-data');
        let options = new RequestOptions({ headers: this.headers });
        let body: any = JSON.stringify(postData);
        let url: string = 'http://10.209.69.58:5000/generatefile';
        this.service = this     .http
                                .post(url, body, options)
                                .map((response: any) => {
                                    console.log(response);
                                    let blob = new Blob([response._body], { type: 'application/download' });
                                    let url= window.URL.createObjectURL(blob);
                                    let a : any = document.createElement('a');
                                    
                                    a.href = url;
                                    a.download = "pom.xml" ;
                                    document.body.appendChild(a);
                                    a.click();
                                    // window.open(url);
                                })
                                .catch(this.handleError);

        //this.testRoute();

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
