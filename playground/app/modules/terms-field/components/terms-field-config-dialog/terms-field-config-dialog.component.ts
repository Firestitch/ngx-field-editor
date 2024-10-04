import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TermType } from '../../enums';
import { Term } from '../../interfaces/term';


@Component({
  selector: 'app-terms-field-config-dialog',
  styleUrls: ['./terms-field-config-dialog.component.scss'],
  templateUrl: './terms-field-config-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsFieldConfigDialogComponent implements OnInit {

  public disabled = false;
  public term: Term;
  public TermType = TermType;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<TermsFieldConfigDialogComponent>,
  ) {}

  public ngOnInit(): void {
    this.term = {
      ...this._data.term,
      type: this._data.term.type || TermType.None
    };
  }

  public save = (): Observable<any> => {
    return of(this.term)
    .pipe(
      tap((term) => {
        this._dialogRef.close(term);
      }),
    );
  }

  public contentLabelBlur(): void {
    if(!this.term.contentTitle) {
      this.term.contentTitle = this.term.contentLabel;
    }
  }

}
