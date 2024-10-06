import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsExampleModule } from '@firestitch/example';
import {
  FsFieldEditorModule, FsFieldRendererModule, FsFieldViewerModule,
} from '@firestitch/field-editor';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FS_MAP_GOOGLE_MAP_KEY } from '@firestitch/map';
import { FsMessageModule } from '@firestitch/message';
import { FsPhoneModule } from '@firestitch/phone';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  ExampleComponent,
  ExamplesComponent,
  FieldRenderComponent,
} from './components';
import { AppMaterialModule } from './material.module';
import { SignatureFieldModule } from './modules/signature-field';
import { TermsFieldModule } from './modules/terms-field';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,

    FsFieldEditorModule.forRoot(),
    FsFieldViewerModule,
    FsFieldRendererModule,
    FsDatePickerModule.forRoot(),
    FsMessageModule.forRoot(),
    FsHtmlEditorModule.forRoot(),
    FsPhoneModule.forRoot(),
    FsFileModule.forRoot(),
    FsFormModule,
    FsLabelModule,
    FsExampleModule.forRoot(),

    BrowserAnimationsModule,
    AppMaterialModule,
    RouterModule.forRoot(routes, {}),
    TermsFieldModule,
    SignatureFieldModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    FieldRenderComponent,
  ],
  providers: [
    {
      provide: FS_MAP_GOOGLE_MAP_KEY,
      useFactory: () => '',
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class PlaygroundModule {
}
