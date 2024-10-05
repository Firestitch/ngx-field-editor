import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';

import { guid } from '@firestitch/common';

import { Subject } from 'rxjs';


import { FieldType } from '../../../../enums/field-type';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


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
    this._destory$.next(null);
    this._destory$.complete();
  }

  public fieldSave() {
    this.fieldEditor.fieldChange(this.field);
  }

}
