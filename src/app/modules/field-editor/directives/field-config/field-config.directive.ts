
import { Directive, TemplateRef, Input } from '@angular/core';


@Directive({
  selector: '[fsFieldConfig]',
})
export class FieldConfigDirective {

  @Input() public type;

  constructor(public templateRef: TemplateRef<any>) {}
}
