import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TypeAheadDependencyComponent } from './typeahead-dependency.component';
import { MockAuthenticationService } from '../shared/mock-auth.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [TypeAheadDependencyComponent],
    providers: [MockAuthenticationService],
    exports: [TypeAheadDependencyComponent]
})

export class TypeAheadDependencyModule {}
