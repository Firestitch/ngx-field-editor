import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { guid } from '@firestitch/common';

import { Subject } from 'rxjs';


import { Field } from '../../../interfaces';
import { FieldType } from '../../../enums/field-type';
import { FieldEditorService } from '../../../services';
import { EditorAction } from '../../../enums';


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

  constructor(
    public fieldEditor: FieldEditorService,
  ) {
  }

  public ngOnDestroy() {
    this._destory$.next();
    this._destory$.complete();
  }

  public fieldSave() {
    this.fieldEditor.action(EditorAction.FieldSave, this.field)
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
      });
  }

}
