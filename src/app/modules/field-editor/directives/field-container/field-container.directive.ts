
import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsFieldContainer]',
})
export class FieldContainerDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}
