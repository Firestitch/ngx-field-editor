import { Component, Input, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';

import { guid } from '@firestitch/common';

import { initField } from './../../helpers/init-field';
import { Field } from '../../interfaces/field.interface';
import { FieldType } from '../../enums/field-type';
import { FieldMode } from '../../enums/field-mode';
import { FieldEditorComponent } from '../field-editor/field-editor.component';


@Component({
  template: '',
})
export class FieldComponent implements OnDestroy, OnInit {

  @Output() changed = new EventEmitter();

  public fieldMode = FieldMode;
  public fieldType = FieldType;
  public field: Field = null;
  public name = `field-${guid()}`;

  protected $destory = new EventEmitter();

  @Input('field') set _field(field: Field) {
    this.setField(field);
  }

  public setField(field) {
    this.field = this.initField(field);
  }

  @Input() public fieldEditor: FieldEditorComponent = null;

  public ngOnDestroy() {
    this.$destory.complete();
  }

  public ngOnInit(): void {
    this.field = this.initField(this.field);
  }

  public initField(field) {
    return initField(field);
  }

}
