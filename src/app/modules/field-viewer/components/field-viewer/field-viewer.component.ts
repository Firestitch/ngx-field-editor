import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';


import { FieldType } from '../../../../enums';
import { FieldViewerConfig, ViewField } from '../../../../interfaces';
import { FieldViewerService } from '../../../../services';
import { FieldViewDirective } from '../../directives/field-view/field-view.directive';


@Component({
  selector: 'fs-field-viewer',
  templateUrl: './field-viewer.component.html',
  styleUrls: ['./field-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FieldViewerService],
})
export class FieldViewerComponent implements AfterContentInit {

  @ContentChildren(FieldViewDirective)
  public fieldViews: QueryList<FieldViewDirective>;

  @Input() public hideNotSpecified = false;

  public fieldViewTemplateRefs = {};
  public FieldType = FieldType;
  public fields: ViewField[] = [];

  @Input('config')
  public set setConfig(config: FieldViewerConfig) {
    this._fieldViewerService.init(config);

    this.fields =
      this._fieldViewerService.fields
        .filter((field) => {
          return !this.hideNotSpecified || field.hasValue;
        });
  }

  constructor(
    private _fieldViewerService: FieldViewerService,
  ) { }

  public get fieldViewer() {
    return this._fieldViewerService;
  }

  public ngAfterContentInit() {
    this.fieldViews.forEach((directive: FieldViewDirective) => {
      this.fieldViewTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
