import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ComponentAnalysisService } from './component-analysis.service';

@Component({
    selector: 'component-analysis',
    templateUrl: './component-analysis.component.html',
    styleUrls: ['./component-analysis.component.scss'],
    providers: [ComponentAnalysisService]
})

export class ComponentAnalysisComponent {
    @Input('component') component;
    private subscription: Subscription;
    public componentAnalysis: any = {};
    private cache: any = {};

    constructor(private componentAnalysisService: ComponentAnalysisService) {}

    public showComponentAnalysis(): void {
        if (this.component) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            if (this.cache && this.cache[this.component.name] !== undefined) {
                this.componentAnalysis = this.cache[this.component.name];
            } else {
                this.subscription = this    .componentAnalysisService
                                            .getComponentAnalysis(this.component)
                                            .subscribe(response => {
                                                if (response) {
                                                    console.log(response);
                                                    debugger;
                                                    let pack: any = response.result.data[0].package;
                                                    let github: any = {};
                                                    github['forks'] = pack['gh_forks'][0];
                                                    github['issues'] = pack['gh_open_issues_count'][0];
                                                    github['stars'] = pack['gh_stargazers'][0];
                                                    github['subscribes'] = pack['gh_subscribers_count'][0];

                                                    this.componentAnalysis['github'] = github;
                                                    this.componentAnalysis['latest_version'] = pack['latest_version'][0];
                                                    this.componentAnalysis['tokens'] = pack['tokens'];
                                                    this.cache[this.component.name] = this.componentAnalysis;
                                                }
                                            });
            }
        }
    }
}
