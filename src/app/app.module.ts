import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';

import { MockAuthenticationService } from './shared/mock-auth.service';

import { ProjectGenerationModule } from './project-generation/proejct-generation.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ProjectGenerationModule
  ],
  providers: [
    {
      provide: AuthenticationService, useClass: MockAuthenticationService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
