import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TermType } from '../../enums';
import { Term } from '../../interfaces/term';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'app-terms-field-config-dialog',
    styleUrls: ['./terms-field-config-dialog.component.scss'],
    templateUrl: './terms-field-config-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatSelect,
        MatOption,
        FsHtmlEditorModule,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
})
export class TermsFieldConfigDialogComponent implements OnInit {
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<TermsFieldConfigDialogComponent>>(MatDialogRef);


  public disabled = false;
  public term: Term;
  public TermType = TermType;

  public ngOnInit(): void {
    this.term = {
      ...this._data.term,
      type: this._data.term.type || TermType.None,
    };
  }

  public save = (): Observable<any> => {
    return of(this.term)
      .pipe(
        tap((term) => {
          this._dialogRef.close(term);
        }),
      );
  };

  public contentLabelBlur(): void {
    if(!this.term.contentTitle) {
      this.term.contentTitle = this.term.contentLabel;
    }
  }

}
