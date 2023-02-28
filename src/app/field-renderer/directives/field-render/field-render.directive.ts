
import { Directive, TemplateRef, Input } from '@angular/core';

import { Field } from '../../../interfaces/field.interface';


@Directive({
  selector: '[fsFieldRender]',
})
export class FieldRenderDirective {

  @Input() type;
  @Input() field: Field;

  constructor(public templateRef: TemplateRef<any>) { }
}
