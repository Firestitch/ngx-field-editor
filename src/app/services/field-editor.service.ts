import { Injectable, Inject, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { guid } from '@firestitch/common';

import { BehaviorSubject, isObservable, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import {
  Field,
} from '../interfaces/field.interface';
import { FS_FIELD_EDITOR_CONFIG } from '../injectors/fs-field-editor.providers';
import { initField } from '../helpers/init-field';
import { FieldType } from '../enums/field-type';
import { FieldEditorConfig, FsFieldEditorCallbackParams } from '../interfaces/field-editor-config.interface';


@Injectable()
export class FieldEditorService implements OnDestroy {

  public config: FieldEditorConfig = {};
  public editorId = 'fs-fields-' + guid();

  public inDeletionMode = false;

  private _selectedField$ = new BehaviorSubject<Field>(null);
  private _scrollTargetField: Field = null;
  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(FS_FIELD_EDITOR_CONFIG) private _defaultConfig: FieldEditorConfig,
  ) {}

  public get selectedField(): Field {
    return this._selectedField$.getValue();
  }

  public get selectedField$(): Observable<Field> {
    return this._selectedField$.asObservable();
  }

  public get fields(): Field[] {
    return cloneDeep(this.config.fields);
  }

  public set fields(fields: Field[]) {
    this.config.fields = fields;
  }

  public get hasFields(): boolean {
    return this.config?.fields.length > 0;
  }

  public get numberOfFields(): number {
    return this.config.fields.length;
  }

  public get scrollTargetField(): Field {
    return this._scrollTargetField;
  }

  public fieldCanDelete(field: Field): Observable<boolean> {
    return this.config.fieldCanDelete ? 
    this.config.fieldCanDelete(field) : 
    of(true);
  }

  public fieldCanEdit(field: Field): Observable<boolean> {
    return this.config.fieldCanEdit ? 
    this.config.fieldCanEdit(field) : 
    of(true);
  }

  public fieldCanDuplicate(field: Field): Observable<boolean> {
    return this.config.fieldCanDuplicate ? 
    this.config.fieldCanDuplicate(field) : 
    of(true);
  }

  public fieldCanRequire(field: Field): Observable<boolean> {
    return this.config.fieldCanRequire ? 
    this.config.fieldCanRequire(field) : 
    of(field.config.hideRequired !== true);
  }

  public fieldCanLabel(field: Field): Observable<boolean> {
    return this.config.fieldCanLabel ? 
    this.config.fieldCanLabel(field) : 
    of(true);
  }

  public fieldCanConfig(field: Field): Observable<boolean> {
    return this.config.fieldCanConfig ? 
    this.config.fieldCanConfig(field) : 
    of(true);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public selectField(field: Field): Observable<Field> {
    if (this.selectedField) {
      this.unselectField();
    }
    
    return this.fieldSelected(field)
    .pipe(
      tap(() => this._selectedField$.next(field))
    );
  }

  public unselectField() {
    this.fieldUnselected({
      field: this.selectedField
    });

    this._selectedField$.next(null);
  }

  public setConfig(config: FieldEditorConfig) {
    this.config = { ...this._defaultConfig, ...config };

    if (this.config.fields) {
      this.config.fields = this.config.fields.map((field) => {
        return initField(field);
      });
    }
  }

  public insertNewField(field: Field, index?: number, event?: CdkDragDrop<string[]>) {
    field = initField(field);

    if(field.config.type === FieldType.RichText) {
      field.data = { value: field.config.configs?.default || '' };
    } else if(field.config.type === FieldType.Name) {
      field.config.label = '';
    }

    if (index === undefined) {
      if (this.selectedField) {
        index = this.config.fields.indexOf(this.selectedField) + 1;
      } else {
        index = this.numberOfFields;
      }
    }

    const data: FsFieldEditorCallbackParams = {
      field,
      toolbarField: event?.item.data.item,
      event,
      fields: this.fields,
    };

    let result$ = of(field);

    const result = this.fieldAdd(data);
    result$ = isObservable(result) ? result : result$;

    result$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((newField: Field) => {
        this.fieldDrop(field);

        this.config.fields.splice(index, 0, newField);

        this.selectField(newField);

        this._scrollTargetField = newField;

        this.fieldAdded({
          field: newField,
          toolbarField: event?.item.data.item,
        });
      });
  }

  public fieldChanged(item: Field) {
    this.config.fields = this.config.fields
    .map((field) => {
      return field.config.guid === item.config.guid ? item : field;
    });

    if (this.config.fieldChanged) {
      item = this._prepareItem(item);

      this.config.fieldChanged(item);
    }
  }

  public fieldAdd(item: FsFieldEditorCallbackParams): Observable<Field> | void {
    if (this.config.fieldAdd) {
      item = this._prepareItem(item);

      return this.config.fieldAdd(item);
    }
  }

  public fieldAdded(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldAdded) {
      item = this._prepareItem(item);

      this.config.fieldAdded(item);
    }
  }

  public fieldSelected(field: Field): Observable<Field> {
    return of(true)
    .pipe(
      switchMap(() => {        
        if (this.config.fieldSelected) {
          const item = this._prepareItem(field);
          const result = this.config.fieldSelected(item);
            
          return result instanceof Observable ? result : of(field);
        }

        return of(field);
      }),
    );
  }

  public fieldUnselected(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldUnselected) {
      item = this._prepareItem(item);

      this.config.fieldUnselected(item);
    }
  }

  public fieldMoved(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldMoved) {
      item = this._prepareItem(item);

      this.config.fieldMoved(item);
    }
  }

  public fieldDuplicate(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldDuplicate) {
      item = this._prepareItem(item);

      this.config.fieldDuplicate(item);
    }
  }

  public fieldDrop(item: Field) {
    if (this.config.fieldDrop) {
      item = this._prepareItem(item);

      this.config.fieldDrop(item);
    }
  }

  public fieldDuplicated(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldDuplicated) {
      item = this._prepareItem(item);

      this.config.fieldDuplicated(item);
    }
  }

  public fieldRemoved(item: FsFieldEditorCallbackParams) {
    if (this.config.fieldRemoved) {
      item = this._prepareItem(item);

      this.config.fieldRemoved(item);
    }
  }

  public resetScrollTarget(): void {
    this._scrollTargetField = null;
  }

  private _prepareItem(params: Field | FsFieldEditorCallbackParams): any {
    const item = {
      fields: cloneDeep(this.config.fields),
      ...params,
    };

    return item;
  }
}
