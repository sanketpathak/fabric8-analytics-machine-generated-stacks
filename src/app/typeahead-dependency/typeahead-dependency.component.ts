import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { TypeAheadDependencyService } from './typeahead-dependency.service';
import { ComponentAnalysisService } from '../component-analysis/component-analysis.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'typeahead-dependency',
    templateUrl: './typeahead-dependency.component.html',
    styleUrls: ['./typeahead-dependency.component.scss'],
    providers: [TypeAheadDependencyService, ComponentAnalysisService]
})

export class TypeAheadDependencyComponent {
    @Input('selectedEcosystem') ecosystem;
    @Output() onTypeAhead = new EventEmitter();

    public userSearch: string;
    public suggestions: Array<any> = [];
    public isLoading: boolean = false;
    private subscription: Subscription;

    @Output() onAnalyze = new EventEmitter();
    @Output() onOut = new EventEmitter();
    private subscriptionComponent: Subscription;
    public componentAnalysis: any = {};
    private cache: any = {};
    public showDetail: boolean = false;

    constructor(private typeAheadDependencyService: TypeAheadDependencyService,
                private componentAnalysisService: ComponentAnalysisService) {}

    /** Address the redundancy */
    public handleMouseOut(): void {
        this.onOut.emit(true);
    }

    public showComponentAnalysis(component: any, comp: Element): void {
        if (component) {
            if (this.subscriptionComponent) {
                this.subscriptionComponent.unsubscribe();
            }
            if (this.cache && this.cache[component.name] !== undefined) {
                this.componentAnalysis = this.cache[component.name];
                this.showDetail = true;
                this.onAnalyze.emit({
                    content: this.componentAnalysis,
                    ref: comp
                });
            } else {
                this.subscriptionComponent = this    .componentAnalysisService
                                            .getComponentAnalysis(component)
                                            .subscribe(response => {
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
                                                    this.cache[component.name] = this.componentAnalysis;
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
    /** Address the redundancy */

    onInputChange(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.suggestions = [];
        this.subscription = this   .typeAheadDependencyService
                                        .getMatchingDependencies(this.userSearch)
                                        .subscribe(result => {
                                            console.log(result);
                                            this.isLoading = false;
                                            if (result) {
                                                let response: Array<any> = result.result;
                                                this.suggestions = [];
                                                if (response && response.length > 0) {
                                                    response = response.filter(a => a.ecosystem === this.ecosystem);
                                                    // this.suggestions = Array.from(new Set(response.map(r => r.name)));
                                                    this.suggestions = response;
                                                }
                                            }
                                        });
    }

    public handleSearch(): void {
        console.log(this.userSearch);
        this.isLoading = true;
        // setTimeout(() => {
        //     this.suggestions = ['sugg1', 'sugg2', 'sugg3'];
        //     this.isLoading = false;
        // }, 3000);
        this.onInputChange();
    }

    public handleSuggestionClick(suggestion: any, element: Element): void {
        console.log(suggestion);
        console.log(element);
        let output: any = {};
        output['suggestion'] = suggestion;
        if (element.classList.contains('clicked-suggestion')) {
            element.classList.remove('clicked-suggestion');
            output['status'] = 'removed';
        } else {
            element.classList.add('clicked-suggestion');
            output['status'] = 'added';
        }
        this.onTypeAhead.emit(output);
    }
}
