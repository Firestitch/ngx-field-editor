
import { Directive, TemplateRef, Input, inject } from '@angular/core';


@Directive({
    selector: '[fsFieldView]',
    standalone: true
})
export class FieldViewDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  @Input() type;
}
