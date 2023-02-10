
import { Directive, TemplateRef, Input } from '@angular/core';


@Directive({
  selector: '[fsFieldMessage]'
})
export class FieldMessageDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
