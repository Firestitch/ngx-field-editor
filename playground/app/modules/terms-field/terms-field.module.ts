import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsSignatureModule } from '@firestitch/signature';

import {
  TermsFieldConfigComponent,
  TermsFieldConfigDialogComponent,
  TermsFieldRenderComponent,
  TermsFieldRenderDialogComponent,
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

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
