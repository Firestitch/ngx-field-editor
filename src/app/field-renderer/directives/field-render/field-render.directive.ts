
import { Directive, TemplateRef, Input } from '@angular/core';

import { Field } from '../../../interfaces/field.interface';


@Directive({
  selector: '[fsFieldRender]',
})
export class FieldRenderDirective {

  @Input() public type;
  @Input() public field: Field;

  constructor(public templateRef: TemplateRef<any>) { }
}
