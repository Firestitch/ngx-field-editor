import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { FsFormModule } from '@firestitch/form';
import { FsSignatureModule } from '@firestitch/signature';
import { FsLabelModule } from '@firestitch/label';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsListModule } from '@firestitch/list';

import { 
  TermsFieldConfigDialogComponent,
  TermsFieldRenderDialogComponent, TermsFieldRenderComponent, 
  TermsFieldConfigComponent
 } from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    FlexLayoutModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,

    FsFormModule,
    FsLabelModule,
    FsHtmlEditorModule,
    FsHtmlRendererModule,
    FsDialogModule,
    FsDateModule,
    FsListModule,
    FsSignatureModule,
  ],
  declarations: [
    TermsFieldConfigComponent,
    TermsFieldRenderComponent,
    TermsFieldRenderDialogComponent,
    TermsFieldConfigDialogComponent,
  ],
  exports: [
    TermsFieldConfigComponent,
    TermsFieldRenderComponent,
  ],
})
export class TermsFieldModule {}
