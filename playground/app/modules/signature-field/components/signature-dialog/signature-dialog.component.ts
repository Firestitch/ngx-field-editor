import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
    templateUrl: './signature-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SignatureDialogComponent {

  public field;
  public signature;

  constructor(
    private _dialogRef: MatDialogRef<SignatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.field = data.field;
  }

  public continue = () => {
    return of(true)
      .pipe(
        tap(() => this._dialogRef.close(this.signature)),
      );
  };

}
