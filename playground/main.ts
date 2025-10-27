import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsExampleModule } from '@firestitch/example';
import { FsFieldEditorModule } from '@firestitch/field-editor';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FS_MAP_GOOGLE_MAP_KEY } from '@firestitch/map';
import { FsMessageModule } from '@firestitch/message';
import { FsPhoneModule } from '@firestitch/phone';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';


import { AppComponent } from './app/app.component';
import { ExamplesComponent } from './app/components';
import { environment } from './environments/environment';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule, BrowserModule, FsFieldEditorModule.forRoot(), FsDatePickerModule.forRoot(), FsMessageModule.forRoot(), FsHtmlEditorModule.forRoot(), FsPhoneModule.forRoot(), FsFileModule.forRoot(), FsFormModule, FsLabelModule, FsExampleModule.forRoot()),
    {
      provide: FS_MAP_GOOGLE_MAP_KEY,
      useFactory: () => '',
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(routes),
  ],
})
  .catch((err) => console.error(err));

