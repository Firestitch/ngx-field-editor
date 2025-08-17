
import { Directive, TemplateRef } from '@angular/core';

import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Directive({
  selector: '[fsFieldContainer]',
})
export class FieldContainerDirective {
  constructor(public templateRef: TemplateRef<any>) { }

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
