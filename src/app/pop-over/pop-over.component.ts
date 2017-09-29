import { Component, Output, OnChanges, EventEmitter } from '@angular/core';

import { PopoverService } from './pop-over.service';

@Component({
    selector: 'pop-over-component',
    templateUrl: './pop-over.component.html',
    styleUrls: ['./pop-over.component.scss'],
    providers: [PopoverService]
})

export class PopoverComponent implements OnChanges {
    constructor(private popoverService: PopoverService) {}
    public structure: any;
    ngOnChanges(): void {
        if (this.popoverService.components) {
            this.structure = this.popoverService.components[0];
            console.log(this.structure);
        }
    }
}
