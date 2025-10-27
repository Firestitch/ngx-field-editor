import { ChangeDetectionStrategy, Component, inject } from '@angular/core';


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
  dialogRef = inject<MatDialogRef<TermsFieldRenderDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


  public term: Term;

  constructor() {
    const data = this.data;

    this.term = data.term;
  }

}
