import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectGenerationComponent } from './project-generation.component';
import { TypeAheadDependencyModule } from '../typeahead-dependency/typeahead-dependency.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeAheadDependencyModule
    ],
    declarations: [ProjectGenerationComponent],
    exports: [ProjectGenerationComponent]
})

export class ProjectGenerationModule {}
