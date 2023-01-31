import { Injectable, Inject, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { guid } from '@firestitch/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import {
  Field,
} from '../interfaces/field.interface';
import { FS_FIELD_EDITOR_CONFIG } from '../injectors/fs-field-editor.providers';
import { initField } from '../helpers/init-field';
import { FieldEditorConfig, FsFieldEditorCallbackParams } from '../interfaces/field-editor-config.interface';
import { FieldAction } from '../enums';


@Injectable()
export class FieldEditorService implements OnDestroy {

  public config: FieldEditorConfig;
  public editorId = 'fs-fields-' + guid();

  public inDeletionMode = false;

  private _selectedField$ = new BehaviorSubject<Field>(null);
  private _scrollTargetField: Field = null;
  private _destroy$ = new Subject<void>();
  private _fieldAdded$ = new Subject<Field>();

  constructor(
    @Inject(FS_FIELD_EDITOR_CONFIG) private _defaultConfig: FieldEditorConfig,
  ) {}

  public get fieldAdded$(): Observable<Field> {
    return this._fieldAdded$.asObservable();
  }

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

  public selectField(field: Field): void {
    this.config.beforeFieldSelected(field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._selectedField$.next(field);
      });
  }

  public unselectField() {
    if(this.selectedField) {
      this.config.afterFieldUnselected(this.selectedField);
      this._selectedField$.next(null);
    }
  }

  public setConfig(config: FieldEditorConfig) {
    this.config = { 
      ...this._defaultConfig, 
      ...config,
    };

    this.config = { 
      ...config,
      afterFieldUnselected: config.afterFieldUnselected ? config.afterFieldUnselected : (field: Field) => { return of(field); },      
      afterFieldDuplicated: config.afterFieldDuplicated ? config.afterFieldDuplicated : (field: Field) => { return of(field); },
      afterFieldDropped: config.afterFieldDropped ? config.afterFieldDropped : (field: Field) => { return of(field); },
      afterFieldAdded: config.afterFieldAdded ? config.afterFieldAdded : (field: Field) => { return of(field); },
      beforeFieldAdded: config.beforeFieldAdded ? config.beforeFieldAdded : (field: Field) => { return of(field); },
      beforeFieldSelected: config.beforeFieldSelected ? config.beforeFieldSelected : (field: Field) => { return of(field); },
      beforeFieldDuplicated: config.beforeFieldDuplicated ? config.beforeFieldDuplicated : (field: Field) => { return of(field); },
    };

    if (this.config.fields) {
      this.config.fields = this.config.fields.map((field) => {
        return initField(field);
      });
    }
  }

  public insertNewField(field: Field, index?: number, event?: CdkDragDrop<string[]>): Observable<Field> {
    field = initField(field);

    if (index === undefined) {
      if (this.selectedField) {
        index = this.config.fields.indexOf(this.selectedField) + 1;
      } else {
        index = this.numberOfFields;
      }
    }

    return this.config.beforeFieldAdded(field, event?.item.data.item)
      .pipe(
        switchMap((field) => this.fieldAction(FieldAction.FieldAdd, field, { index })),
        switchMap((response) => {
          const newField = initField(response.field);
          this.config.fields.splice(index, 0, newField);
          this._scrollTargetField = newField;
          this._fieldAdded$.next(newField);

          return this.config.afterFieldAdded(newField);
        }),
        takeUntil(this._destroy$),
      );
  }

  public fieldChange(field: Field): void {
    this.config.fields = this.config.fields
      .map((_field) => {
        return _field.config.guid === field.config.guid ? field : _field;
      });

    if (this.config.fieldChanged) {
      field = this._prepareItem(field);

      this.config.fieldChanged(field);
    }
  }

  public fieldAction(action: FieldAction, field: Field = null, data: any = {}): Observable<any> {
    return (
      this.config.fieldAction ?
      this.config.fieldAction(action, field, data) :
      of(field)
    )
    .pipe(
      tap((field) => {
   
      }),
    );
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
