import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { format } from '@firestitch/date';

import { Observable, of } from 'rxjs';

import { FieldType, VisualSelectorFormat } from '../../../../enums';
import { FieldOption } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {

  public field: FieldOption;
  public populateValue = '';
  public FieldType = FieldType;
  public fieldEditor: FieldEditorService;
  public VisualSelectorFormat = VisualSelectorFormat;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _dialogRef: MatDialogRef<SettingsComponent>,
  ) { }

  public ngOnInit(): void {
    this.field = this._data.field;
    this.fieldEditor = this._data.fieldEditor;

    this.populateValue = this.field.type === FieldType.Date ? format(new Date(), 'yyyy-MM-dd') : 'PopulatedValue';
  }

  public get type(): FieldType | string {
    return this.field.type;
  }

  public get configs() {
    return this.field.configs;
  }

  public save = (): Observable<any> => {
    this.fieldEditor.fieldChange(this.field);
    this._dialogRef.close(this.field);

    return of(null);
  };


}
