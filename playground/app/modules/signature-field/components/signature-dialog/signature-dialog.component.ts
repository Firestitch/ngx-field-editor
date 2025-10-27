import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
    templateUrl: './signature-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SignatureDialogComponent {
  private _dialogRef = inject<MatDialogRef<SignatureDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


  public field;
  public signature;

  constructor() {
    const data = this.data;

    this.field = data.field;
  }

  public continue = () => {
    return of(true)
      .pipe(
        tap(() => this._dialogRef.close(this.signature)),
      );
  };

}
