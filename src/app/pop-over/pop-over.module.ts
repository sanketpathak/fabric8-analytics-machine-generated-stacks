import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PopoverComponent } from './pop-over.component';
import { PopoverDirective } from './pop-over.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [PopoverComponent, PopoverDirective],
    exports: [PopoverComponent, PopoverDirective]
})

export class PopoverModule {}
