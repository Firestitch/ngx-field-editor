import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { format } from '@firestitch/date';

import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FieldAction, FieldType, VisualSelectorFormat } from '../../../enums';
import { FieldOption } from '../../../interfaces';
import { FieldEditorService } from '../../../services';


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
  ) {}

  public ngOnInit(): void {
    this.field = this._data.field;
    this.fieldEditor = this._data.fieldEditor;

    if(this.field.config.type === FieldType.Date) {
      this.populateValue =  format(new Date(),'yyyy-MM-dd');
    } else {
      this.populateValue = 'PopulatedValue';
    }
  }

  public get type(): FieldType|string {
    return this.field.config.type;
  }

  public get configs() {
    return this.field.config.configs;
  }

  public save = (): Observable<any> => {
    return this.fieldEditor.fieldAction(FieldAction.FieldSave, this.field)
    .pipe(
      tap(() => this._dialogRef.close(this.field)),
    );
  }


}
