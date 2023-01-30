import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subject } from 'rxjs';

import { guid } from '@firestitch/common';

import { Field, FieldOption } from '../../../interfaces';
import { FieldType } from '../../../enums/field-type';
import { FieldEditorService } from '../../../services';
import { FieldAction } from '../../../enums';


@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnDestroy {

  @Input() public disabled = false;

  @Input() public field: Field;

  public FieldType = FieldType;
  public name = `field-${guid()}`;

  protected _destory$ = new Subject();

  public constructor(
    public fieldEditor: FieldEditorService,
  ) {
  }

  public ngOnDestroy() {
    this._destory$.next();
    this._destory$.complete();
  }

  public fieldSave() {
    this.fieldEditor.fieldAction(FieldAction.FieldSave, this.field)
    .subscribe(() => {
      this.fieldEditor.fieldChanged(this.field);
    });
  }

}
