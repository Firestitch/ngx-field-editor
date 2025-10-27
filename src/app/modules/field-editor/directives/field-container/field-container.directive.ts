
import { Directive, TemplateRef, inject } from '@angular/core';

import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Directive({
    selector: '[fsFieldContainer]',
    standalone: true,
})
export class FieldContainerDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  public static ngTemplateContextGuard(
    directive: FieldContainerDirective,
    context: unknown,
  ): context is {
    $implicit: Field,
    field: Field,
    fieldEditor: FieldEditorService,
    selected: boolean,
    template: TemplateRef<any>,
  } {
    return true;
  }
}
