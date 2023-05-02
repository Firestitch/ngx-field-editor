import { Component, Input, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';

import { guid } from '@firestitch/common';

import { Field, FieldOption } from '../../../interfaces';
import { FieldType } from '../../../enums/field-type';
import { FieldMode } from '../../../enums/field-mode';

import { initField } from './../../../helpers/init-field';


@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnDestroy, OnInit {

  @Input() public disabled = false;

  @Input('field') public set _field(field: Field) {
    this.setField(field);
  }

  @Output() public changed = new EventEmitter();

  public fieldMode = FieldMode;
  public fieldType = FieldType;
  public field: FieldOption;
  public name = `field-${guid()}`;

  protected _destory$ = new EventEmitter();

  public setField(field) {
    this.field = this.initField(field);
  }

  public ngOnDestroy() {
    this._destory$.complete();
  }

  public ngOnInit(): void {
    this.field = this.initField(this.field);
  }

  public get configs() {
    return this.field.configs;
  }

  public initField(field) {
    return initField(field);
  }

}
