
import { Directive, Input, TemplateRef, inject } from '@angular/core';

import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Directive({
  selector: '[fsFieldRender]',
  standalone: true,
})
export class FieldRenderDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  @Input() public type;
  @Input() public field: Field;

  public static ngTemplateContextGuard(
    directive: FieldRenderDirective,
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
