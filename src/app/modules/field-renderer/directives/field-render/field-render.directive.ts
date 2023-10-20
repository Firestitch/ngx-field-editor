
import { Directive, Input, TemplateRef } from '@angular/core';

import { Field } from '../../../../interfaces';


@Directive({
  selector: '[fsFieldRender]',
})
export class FieldRenderDirective {

  @Input() public type;
  @Input() public field: Field;

  constructor(public templateRef: TemplateRef<any>) { }
}
