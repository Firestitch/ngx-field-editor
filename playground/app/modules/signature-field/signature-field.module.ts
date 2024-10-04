import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsSignatureModule } from '@firestitch/signature';

import {
  SignatureDialogComponent,
  SignatureFieldRenderComponent,
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
    FsDialogModule,
    FsDateModule,
    FsListModule,
    FsSignatureModule,
  ],
  declarations: [
    SignatureDialogComponent,
    SignatureFieldRenderComponent,
  ],
  exports: [
    SignatureDialogComponent,
    SignatureFieldRenderComponent,
  ],
})
export class SignatureFieldModule {}
