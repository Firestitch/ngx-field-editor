import { Component, Input, AfterViewInit, QueryList, ContentChildren } from '@angular/core';
import { FieldCoreComponent } from '../field-core/field-core.component';
import { FieldCustomRenderDirective } from '../../directives/field-custom-render/field-custom-render.directive';

@Component({
  selector: 'fs-field-render',
  templateUrl: 'field-render.component.html'
})
export class FieldRenderComponent extends FieldCoreComponent implements AfterViewInit {

    public fieldCustomRenderTemplateRefs = {};
    public field: any = { config: {} };

    @Input('field') set setField(field) {
      this.field = field;
    }

    @ContentChildren(FieldCustomRenderDirective) queryListFieldCustomRender: QueryList<FieldCustomRenderDirective>;

    ngAfterViewInit() {

      this.queryListFieldCustomRender.forEach((directive: FieldCustomRenderDirective) => {
        this.fieldCustomRenderTemplateRefs[directive.type] = directive.templateRef;
      });
    }
  }
