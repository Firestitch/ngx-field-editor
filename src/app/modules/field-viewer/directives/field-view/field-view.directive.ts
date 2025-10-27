
import { Directive, TemplateRef, Input } from '@angular/core';


@Directive({
    selector: '[fsFieldView]',
    standalone: true
})
export class FieldViewDirective {

  @Input() type;

  constructor(public templateRef: TemplateRef<any>) {}
}
