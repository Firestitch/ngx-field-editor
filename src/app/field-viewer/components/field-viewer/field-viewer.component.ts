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

  @ContentChildren(FieldViewDirective)
  public fieldViews: QueryList<FieldViewDirective>;

  public fieldViewTemplateRefs = {};

  constructor(
    public fieldEditor: FieldEditorService,
  ) {}

  @Input('config')
  set setConfig(config: FieldEditorConfig) {
    this.fieldEditor.setConfig(config);
  }

  public ngAfterContentInit() {
    this.fieldViews.forEach((directive: FieldViewDirective) => {
      this.fieldViewTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
