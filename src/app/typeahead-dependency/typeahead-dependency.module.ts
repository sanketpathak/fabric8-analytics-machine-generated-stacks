import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TypeAheadDependencyComponent } from './typeahead-dependency.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [TypeAheadDependencyComponent],
    exports: [TypeAheadDependencyComponent]
})

export class TypeAheadDependencyModule {}
