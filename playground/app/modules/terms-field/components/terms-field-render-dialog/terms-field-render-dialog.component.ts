import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import {
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
