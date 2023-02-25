import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import { cloneDeep } from 'lodash-es';

import { Field, FieldRendererConfig } from '../interfaces';
import { RendererAction } from '../enums';


@Injectable()
export class FieldRendererService implements OnDestroy {

  public config: FieldRendererConfig;

  private _destroy$ = new Subject();

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public setConfig(config: FieldRendererConfig) {
    this.config = {
      ...config,
      fieldChanged: config.fieldChanged ? config.fieldChanged : (field: Field) => { },
    };
  }

  public fieldChanged(field: Field): void {
    this.action(RendererAction.FieldChange, field);

    if (this.config.fieldChanged) {
      this.config.fieldChanged(field);
    }
  }

  public get fields(): Field[] {
    return cloneDeep(this.config.fields);
  }

  public set fields(fields: Field[]) {
    this.config.fields = fields;
  }

  public action(action: RendererAction, field: Field, data: any = {}): Observable<any> {
    if (this.config.action) {
      return this.config.action(action, field, data);
    }

    return of({});
  }

  public allowFileDownload(field: Field): Observable<boolean> {
    if (!this.config?.allowFileDownload) {
      return of(false);
    }

    return this.config.allowFileDownload(field);
  }

  public allowFileDelete(field: Field): Observable<boolean> {
    if (!this.config?.allowFileDelete) {
      return of(false);
    }

    return this.config.allowFileDelete(field);
  }

  public allowImageUpload(field: Field): Observable<boolean> {
    if (!this.config?.allowImageUpload) {
      return of(true);
    }

    return this.config.allowImageUpload(field);
  }
}
