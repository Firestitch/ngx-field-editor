
import { Directive, Input, TemplateRef, inject } from '@angular/core';

import { FieldType } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Directive({
    selector: '[fsFieldConfig]',
    standalone: true,
})
export class FieldConfigDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  @Input() public type: string | FieldType;

  public static ngTemplateContextGuard(
    directive: FieldConfigDirective,
    context: unknown,
  ): context is {
    $implicit: Field,
    field: Field,
    fieldEditor: FieldEditorService,
    headerTemplate: TemplateRef<any>,
    configTemplate: TemplateRef<any>,
  } {
    return true;
  }

}
