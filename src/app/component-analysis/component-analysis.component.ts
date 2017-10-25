import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ComponentAnalysisService } from './component-analysis.service';
import { TypeAheadDependencyComponent } from './typeahead-dependency/typeahead-dependency.component';

@Component({
    selector: 'component-analysis',
    templateUrl: './component-analysis.component.html',
    styleUrls: ['./component-analysis.component.scss'],
    providers: [ComponentAnalysisService]
})

export class ComponentAnalysisComponent {
    @Input('component') component;
    @Output() onAnalyze = new EventEmitter();
    @Output() onOut = new EventEmitter();
    @Output() onCloseEmitter = new EventEmitter();
    private subscription: Subscription;
    public componentAnalysis: any = {};
    private cache: any = {};
    public showDetail: boolean = false;
    public showOnScreen: boolean = true;


    constructor(private componentAnalysisService: ComponentAnalysisService) {}

    public handleMouseOut(): void {
        this.onOut.emit(true);
    }
    public emitCloseEvent(element: Element): void {
        this.showOnScreen = false;
        console.log(this.showOnScreen);
        this.onCloseEmitter.emit([this.component, element]);
    }
    public showComponentAnalysis(component: any, comp: Element): void {
        if (this.component) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            if (this.cache && this.cache[this.component.name] !== undefined) {
                this.componentAnalysis = this.cache[this.component.name];
                this.showDetail = true;
                this.onAnalyze.emit({
                    content: this.componentAnalysis,
                    ref: comp
                });
            } else {
                let observable: any = this    .componentAnalysisService
                                                .getComponentAnalysis(this.component);
                
                if (observable) {
                    this.subscription = observable.subscribe(response => {
                        if (response) {
                            console.log(response);
                            debugger;
                            let pack: any = response.result.data[0].package;
                            let github: any = {};
                            github['forks'] = pack['gh_forks'] ? pack['gh_forks'][0] : 'NA';
                            github['issues'] = pack['gh_open_issues_count'] ? pack['gh_open_issues_count'][0] : 'NA';
                            github['stars'] = pack['gh_stargazers'] ? pack['gh_stargazers'][0] : 'NA';
                            github['subscribes'] = pack['gh_subscribers_count'] ? pack['gh_subscribers_count'][0] : 'NA';

                            this.componentAnalysis['github'] = github;
                            this.componentAnalysis['latest_version'] = pack['latest_version'] ? pack['latest_version'][0] : 'NA';
                            this.componentAnalysis['tokens'] = pack['tokens'];
                            this.cache[this.component.name] = this.componentAnalysis;
                            this.onAnalyze.emit({
                                content: this.componentAnalysis,
                                ref: comp
                            });
                        }
                        this.showDetail = true;
                    });
                }
            }
        }
    }
}
