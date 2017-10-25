import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentAnalysisComponent } from './component-analysis.component';
import { TypeAheadDependencyComponent } from './typeahead-dependency/typeahead-dependency.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [ComponentAnalysisComponent],
    exports: [ComponentAnalysisComponent]
})

export class ComponentAnalysisModule {}
