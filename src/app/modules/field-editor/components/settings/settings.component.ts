import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { format } from '@firestitch/date';

import { Observable, of } from 'rxjs';

import { FieldType, VisualSelectorFormat } from '../../../../enums';
import { FieldOption } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsLabelModule } from '@firestitch/label';
import { MatCheckbox } from '@angular/material/checkbox';
import { FsPopoverModule } from '@firestitch/popover';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { PopulateUrlComponent } from '../populate-url/populate-url.component';


@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
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
        MatLabel,
        MatInput,
        FsLabelModule,
        MatCheckbox,
        FsPopoverModule,
        MatIcon,
        MatSelect,
        MatOption,
        MatSuffix,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        NgTemplateOutlet,
        PopulateUrlComponent,
    ],
})
export class SettingsComponent implements OnInit {
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<SettingsComponent>>(MatDialogRef);


  public field: FieldOption;
  public populateValue = '';
  public FieldType = FieldType;
  public fieldEditor: FieldEditorService;
  public VisualSelectorFormat = VisualSelectorFormat;

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
