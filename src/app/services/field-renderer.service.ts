import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import { cloneDeep } from 'lodash-es';

import { RendererAction } from '../enums';
import { initField } from '../helpers';
import { Field, FieldRendererConfig } from '../interfaces';


@Injectable()
export class FieldRendererService implements OnDestroy {

  public config: FieldRendererConfig;

  private _destroy$ = new Subject();

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public setConfig(config: FieldRendererConfig) {
    this.config = {
      ...config,
    };

    this.fields = this.config.fields;
  }

  public fieldChange(field: Field, data: any = null): void {
    this.action(RendererAction.FieldChange, field, data);
  }

  public get fields(): Field[] {
    return this.config.fields;
  }

  public set fields(fields: Field[]) {
    this.config.fields = this.initFields(cloneDeep(fields));
  }

  public initFields(fields: Field[]): Field[] {
    return fields.map((field) => {
      return this.initField(field);
    });
  }

  public initField(field: Field) {
    field = initField(field);

    return {
      ...(this.config.initField ? this.config.initField(field) : field),
    };
  }

  public action(action: RendererAction, field: Field, data: any = {}): Observable<any> {
    if (this.config.action) {
      return this.config.action(action, field, data);
    }

    return of({});
  }

  public canFileDownload(field: Field): Observable<boolean> {
    if (!this.config?.canFileDownload) {
      return of(false);
    }

    return this.config.canFileDownload(field);
  }

  public canFileDelete(field: Field): Observable<boolean> {
    if (!this.config?.canFileDelete) {
      return of(false);
    }

    return this.config.canFileDelete(field);
  }

  public canImageUpload(field: Field): Observable<boolean> {
    if (!this.config?.canImageUpload) {
      return of(true);
    }

    return this.config.canImageUpload(field);
  }
}
