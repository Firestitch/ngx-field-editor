import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnDestroy, Output,
} from '@angular/core';

import { guid } from '@firestitch/common';

import { FieldMode } from '../../../../enums/field-mode';
import { FieldType } from '../../../../enums/field-type';
import { Field } from '../../../../interfaces';


@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnDestroy {

  @Input() public disabled = false;

  @Input() public field: Field;

  @Output() public changed = new EventEmitter();

  public fieldMode = FieldMode;
  public fieldType = FieldType;
  public name = `field-${guid()}`;

  protected _destory$ = new EventEmitter();

  public ngOnDestroy() {
    this._destory$.complete();
  }

  public get configs() {
    return this.field.configs;
  }

}
