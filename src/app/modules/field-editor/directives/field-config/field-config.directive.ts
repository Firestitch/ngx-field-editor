
import { Directive, Input, TemplateRef } from '@angular/core';

import { FieldType } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Directive({
  selector: '[fsFieldConfig]',
})
export class FieldConfigDirective {

  @Input() public type: string | FieldType;

  constructor(public templateRef: TemplateRef<any>) {}

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
