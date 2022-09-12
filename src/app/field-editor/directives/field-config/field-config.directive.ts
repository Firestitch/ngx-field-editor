
import { Directive, TemplateRef, Input } from '@angular/core';


@Directive({
  selector: '[fsFieldConfig]'
})
export class FieldConfigDirective {

  @Input() type;

  constructor(public templateRef: TemplateRef<any>) {}
}
