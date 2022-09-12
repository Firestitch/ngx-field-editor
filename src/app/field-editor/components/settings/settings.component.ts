import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { format } from '@firestitch/date';
import { FieldEditorService } from '../../../services/field-editor.service';

import { Observable, of } from 'rxjs';

import { FieldType } from '../../../enums';
import { Field } from '../../../interfaces';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {

  public field: Field;
  public configs;
  public populateValue = '';
  public FieldType = FieldType;
  public fieldEditor: FieldEditorService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _dialogRef: MatDialogRef<SettingsComponent>,
  ) {}

  public ngOnInit(): void {
    this.field = this._data.field;
    this.configs = { ...this._data.field.config.configs };

    if(this.field.config.type === FieldType.Date) {
      this.populateValue =  format(new Date(),'yyyy-MM-dd');
    } else {
      this.populateValue = 'PopulatedValue';
    }
  }

  public save = (): Observable<any> => {
    const field = {
      ...this.field,
      config: {
        ...this.field.config,
        configs: this.configs,
      }
    };

    this._dialogRef.close(field);
    return of(true);
  }


}
