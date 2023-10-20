import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';


import { FieldType, ViewerAction } from '../enums';
import { Field, FieldOption, FieldViewerConfig, ViewField } from '../interfaces';


@Injectable()
export class FieldViewerService implements OnDestroy {

  public fields: ViewField[];
  private _config: FieldViewerConfig;

  private _destroy$ = new Subject();

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public init(config: FieldViewerConfig) {
    this._config = config;
    this._initFields(config.fields);
  }

  public action(action: ViewerAction, field: Field, data: any = {}): Observable<any> {
    if (this._config.action) {
      return this._config.action(action, field, data);
    }

    return of({});
  }

  public canFileDownload(field: Field): Observable<boolean> {
    return this._config?.canFileDownload ? this._config.canFileDownload(field) : of(false);
  }

  private _showField(field: ViewField): Observable<boolean> {
    if (!this._config?.showField) {
      return of(true);
    }

    return this._config.showField(field);
  }

  private _initFields(fields: (Field | FieldOption)[]): void {
    this.fields = (fields || [])
      .map((field: ViewField) => {
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

          case FieldType.File:
            hasValue = field.data?.files?.length > 0;
            break;

          default:
            hasValue = value !== null && value !== undefined && value !== '';
        }

        return {
          ...field,
          hasValue,
          show: this._showField(field),
        };

      });
  }


}
