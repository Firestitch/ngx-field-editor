import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import {
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Term } from '../../interfaces';


@Component({
  templateUrl: './terms-field-render-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
