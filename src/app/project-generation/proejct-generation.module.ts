import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectGenerationComponent } from './project-generation.component';
import { TypeAheadDependencyModule } from '../typeahead-dependency/typeahead-dependency.module';
import { ComponentAnalysisModule } from '../component-analysis/component-analysis.module';
import { ErrorhandlerModule } from '../errorhandler/errorhandler.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeAheadDependencyModule,
        ComponentAnalysisModule,
        ErrorhandlerModule
    ],
    declarations: [ProjectGenerationComponent],
    exports: [ProjectGenerationComponent]
})

export class ProjectGenerationModule {}
