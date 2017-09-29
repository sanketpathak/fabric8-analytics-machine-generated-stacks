import { Directive, HostListener, Input, OnDestroy, ElementRef } from '@angular/core';
import { PopoverService } from './pop-over.service';

@Directive({
    selector: '[pop-over]'
})

export class PopoverDirective implements OnDestroy {

    @Input('popoverContent') popoverContent;
    private id: number;

    constructor(private element: ElementRef, private popoverService: PopoverService) {}

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.id = Math.random();
        this.popoverService.components.push({
            id: this.id,
            ref: this.element,
            content: this.popoverContent
        });
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.destroy();
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    destroy(): void {
        const idx = this.popoverService.components.findIndex((t) => {
            return t.id === this.id;
        });

        this.popoverService.components.splice(idx, 1);
    }

}
