import { Component, Input } from '@angular/core';
import { Field } from '../../interfaces';

@Component({
  selector: 'fs-form-field-text',
  templateUrl: 'field-text.component.html',
  styleUrls: [ 'field-text.component.scss' ],
})
export class FieldTextComponent {

  @Input() field: Field;
  @Input() fields: Field[];
  constructor() {
  }

}
