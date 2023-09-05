import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Observable, of } from 'rxjs';

import { FieldViewDirective } from '../../directives/field-view/field-view.directive';
import { Field, FieldOption, FieldViewerConfig } from '../../../interfaces';
import { FieldType } from '../../../enums';


@Component({
  selector: 'fs-field-viewer',
  templateUrl: './field-viewer.component.html',
  styleUrls: ['./field-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewerComponent implements AfterContentInit {

  @ContentChildren(FieldViewDirective)
  public fieldViews: QueryList<FieldViewDirective>;

  @Input() public hideNotSpecified = false;

  public fieldViewTemplateRefs = {};
  public FieldType = FieldType;
  public fields: (Field & { hasValue?: boolean; show?: Observable<boolean> })[] = [];

  private _config: FieldViewerConfig;

  @Input('config')
  public set setConfig(config: FieldViewerConfig) {
    this._initWithConfig(config);
  }

  public ngAfterContentInit() {
    this.fieldViews.forEach((directive: FieldViewDirective) => {
      this.fieldViewTemplateRefs[directive.type] = directive.templateRef;
    });
  }

  public showField(field: Field): Observable<boolean> {
    if (!this._config?.showField) {
      return of(true);
    }

    return this._config.showField(field);
  }

  private _initWithConfig(config: FieldViewerConfig): void {
    this._initFields(config?.fields);
    this._config = config;
  }

  private _initFields(fields: (Field | FieldOption)[]): void {
    this.fields = (fields || [])
      .map((field) => {
        const value = field.data?.value;
        let hasValue = false;
        switch (field.type) {
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
          show: this.showField(field),
        };

      })
      .filter((field) => {
        return !this.hideNotSpecified || field.hasValue;
      });
  }
}
