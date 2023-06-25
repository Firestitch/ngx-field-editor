import { Component, Input, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';

import { guid } from '@firestitch/common';

import { Field } from '../../../interfaces';
import { FieldType } from '../../../enums/field-type';
import { FieldMode } from '../../../enums/field-mode';


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
