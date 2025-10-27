import { ChangeDetectionStrategy, Component, Input, OnDestroy, inject } from '@angular/core';

import { guid } from '@firestitch/common';

import { Subject } from 'rxjs';


import { FieldType } from '../../../../enums/field-type';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FieldComponent implements OnDestroy {
  fieldEditor = inject(FieldEditorService);


  @Input() public disabled = false;

  @Input() public field: Field;

  public FieldType = FieldType;
  public name = `field-${guid()}`;

  protected _destory$ = new Subject();

  public ngOnDestroy() {
    this._destory$.next(null);
    this._destory$.complete();
  }

  public fieldSave() {
    this.fieldEditor.fieldChange(this.field);
  }

}
