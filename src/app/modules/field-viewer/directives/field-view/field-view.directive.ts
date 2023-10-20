
import { Directive, TemplateRef, Input } from '@angular/core';


@Directive({
  selector: '[fsFieldView]'
})
export class FieldViewDirective {

  @Input() type;

  constructor(public templateRef: TemplateRef<any>) {}
}
