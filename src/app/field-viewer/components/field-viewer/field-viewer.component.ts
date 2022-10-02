import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FieldViewDirective } from '../../directives/field-view/field-view.directive';
import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldEditorConfig } from '../../../interfaces/field-editor-config.interface';
import { Field } from '../../../interfaces';
import { FieldType } from '../../../enums';


@Component({
  selector: 'fs-field-viewer',
  templateUrl: 'field-viewer.component.html',
  styleUrls: ['field-viewer.component.scss'],
  providers: [
    FieldEditorService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewerComponent implements AfterContentInit {
  
  @Input() public hideNotSpecified = false;

  @ContentChildren(FieldViewDirective)
  public fieldViews: QueryList<FieldViewDirective>;

  public fieldViewTemplateRefs = {};
  public fields: (Field & { hasValue?: boolean })[] = [];

  constructor(
    public fieldEditor: FieldEditorService,
  ) {}

  @Input('config')
  set setConfig(config: FieldEditorConfig) {
    this.fieldEditor.setConfig(config);

    this.fields = [
      ...this.fieldEditor.config.fields
    ];

    this.fields = this.fields
    .map((field) => {
      const value = field.data?.value;
      let hasValue = false;
      switch(field.config.type) {
        case FieldType.Content:
        case FieldType.Heading:
          hasValue = true;
          break;
          
        case FieldType.Address:
          hasValue = Object.keys(value || {}).length !== 0;
        break;

        case FieldType.Choice:
        case FieldType.Checkbox:
          hasValue = Object.keys(value?.selected || []).length !== 0;
        break;
        
        case FieldType.Name:
          hasValue = Object.values(value || {})
            .some((name) => !!name);
        break;

        default:
          hasValue = value !== null && value !== undefined && value !== '';
      }

      return {
        ...field,
        hasValue,
      };
      
    })
    .filter((field) => {
      return !this.hideNotSpecified || field.hasValue;
    });
  }

  public ngAfterContentInit() {
    this.fieldViews.forEach((directive: FieldViewDirective) => {
      this.fieldViewTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
