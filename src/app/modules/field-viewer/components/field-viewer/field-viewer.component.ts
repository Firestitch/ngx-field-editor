import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, QueryList, inject } from '@angular/core';


import { FieldType } from '../../../../enums';
import { FieldViewerConfig, ViewField } from '../../../../interfaces';
import { FieldViewerService } from '../../../../services';
import { FieldViewDirective } from '../../directives/field-view/field-view.directive';
import { FieldViewHeadingComponent } from '../field-view-heading/field-view-heading.component';
import { FsLabelModule } from '@firestitch/label';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FieldViewComponent } from '../field-view/field-view.component';


@Component({
    selector: 'fs-field-viewer',
    templateUrl: './field-viewer.component.html',
    styleUrls: ['./field-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FieldViewerService],
    standalone: true,
    imports: [
        FieldViewHeadingComponent,
        FsLabelModule,
        NgClass,
        MatIcon,
        MatTooltip,
        NgTemplateOutlet,
        FieldViewComponent,
        AsyncPipe,
    ],
})
export class FieldViewerComponent implements AfterContentInit {
  private _fieldViewerService = inject(FieldViewerService);
  private _el = inject(ElementRef);


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

  public get fieldViewer() {
    return this._fieldViewerService;
  }

  public getRenderedValues() {
    return this.fields
      .map((field: ViewField) => {
        return {
          ...field,
          element: this._el.nativeElement.querySelector(`.field[data-field="${field.guid}"] .field-content`),
        }
      });
  }

  public ngAfterContentInit() {
    this.fieldViews.forEach((directive: FieldViewDirective) => {
      this.fieldViewTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
