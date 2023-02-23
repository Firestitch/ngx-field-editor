import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';

import { Field, FieldEditorConfig, IEditDialogAction, IEditDialogData } from '../../../interfaces';
import { EditorAction } from '../../../enums';
import { FieldEditorService } from '../../../services';


@Component({
  templateUrl: './field-edit-dialog.component.html',
  styleUrls: ['./field-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEditDialogComponent implements OnInit, OnDestroy {
  public field: Field;
  public config: FieldEditorConfig;
  public actions: IEditDialogAction[] = [];

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEditDialogData,
    private _fieldEditor: FieldEditorService,
    private _dialogRef: MatDialogRef<FieldEditDialogComponent>,
  ) {
    this.field = data.field;
    this.config = { ...data.config };
  }

  public ngOnInit(): void {
    this.config = {
      ... this.data.config,
      fieldCanEdit: (field: Field) => {
        return of(true);
      },
      fieldShowDelete: (field: Field) => {
        return of(false);
      },
      fieldShowActions: (field: Field) => {
        return of(false);
      },
      fieldShowRequired: (field: Field) => {
        return of(true);
      },
      fieldCanConfig: (field: Field) => {
        return of(true);
      },
      fieldShowDescription: (field: Field) => {
        return of(true);
      },
      fieldShowSettings: (field: Field) => {
        return of(true);
      },
      action: (action: EditorAction, field: Field, data: any): Observable<any> => {
        this.actions.push({
          action,
          field,
          data,
        });

        return of({ field });
      }
    };

    this._fieldEditor.config = this.config;
    this._fieldEditor.selectField(this.field);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save(): void {
    from(this.actions)
      .pipe(
        concatMap(
          (action: IEditDialogAction) => {
            return this.data.config.action(action.action, action.field, action.data);
          },
        ),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._dialogRef.close(this.field);
      });

  }
}
