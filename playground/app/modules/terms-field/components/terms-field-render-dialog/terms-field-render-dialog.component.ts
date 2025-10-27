import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Term } from '../../interfaces';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';


@Component({
    templateUrl: './terms-field-render-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        FsHtmlRendererModule,
        MatDialogActions,
        MatButton,
        FsFormModule,
        MatDialogClose,
    ],
})
export class TermsFieldRenderDialogComponent {

  public term: Term;

  constructor(
    public dialogRef: MatDialogRef<TermsFieldRenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.term = data.term;
  }

}
