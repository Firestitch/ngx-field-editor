import { Directive, TemplateRef } from '@angular/core';

import { FieldEditorService } from '../../../../services';


@Directive({
  selector: '[fsFieldEditorToolbar]',
})
export class FieldEditorToolbarDirective { 

  public static ngTemplateContextGuard(
    directive: FieldEditorToolbarDirective,
    context: unknown,
  ): context is {
    $implicit: TemplateRef<any>,
    fieldEditor: FieldEditorService,
    template: TemplateRef<any>,
  } {
    return true;
  }
}
