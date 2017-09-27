import { Component, Output, OnChanges, EventEmitter } from '@angular/core';
import { TypeAheadDependencyService } from './typeahead-dependency.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'typeahead-dependency',
    templateUrl: './typeahead-dependency.component.html',
    styleUrls: ['./typeahead-dependency.component.scss'],
    providers: [TypeAheadDependencyService]
})

export class TypeAheadDependencyComponent {
    @Output() onTypeAhead = new EventEmitter();

    public userSearch: string;
    public suggestions: Array<any> = [];
    public isLoading: boolean = false;
    private subscription: Subscription;

    constructor(private typeAheadDependencyService: TypeAheadDependencyService) {}

    onInputChange(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this   .typeAheadDependencyService
                                        .getMatchingDependencies(this.userSearch)
                                        .subscribe(result => {
                                            console.log(result);
                                        });
    }

    public handleSearch(): void {
        console.log(this.userSearch);
        this.isLoading = true;
        setTimeout(() => {
            this.suggestions = ['sugg1', 'sugg2', 'sugg3'];
            this.isLoading = false;
        }, 3000);
    }

    public handleSuggestionClick(suggestion: string, element: Element): void {
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
