import { Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash-es';

import { Field, FieldRendererConfig } from '../interfaces';


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
      fieldChanged: config.fieldChanged ? config.fieldChanged : (field: Field) => {}
    };
  }

  public fieldChanged(field: Field): void {
    // this.config.fields = this.config.fields
    //   .map((_field) => {
    //     return _field.config.guid === field.config.guid ? field : _field;
    //   });

    if (this.config.fieldChanged) {
      //field = this._prepareItem(field);

      this.config.fieldChanged(field);
    }
  }

  public get fields(): Field[] {
    return cloneDeep(this.config.fields);
  }

  public set fields(fields: Field[]) {
    this.config.fields = fields;
  }
}