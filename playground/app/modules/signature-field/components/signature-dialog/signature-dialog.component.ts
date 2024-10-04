import { Component, Inject } from '@angular/core';

import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  templateUrl: 'signature-dialog.component.html'
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
  }

}
