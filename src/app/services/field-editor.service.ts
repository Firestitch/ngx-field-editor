import { Injectable, Inject, OnDestroy } from '@angular/core';

import { guid as fsGuid } from '@firestitch/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import {
  Field,
} from '../interfaces/field.interface';
import { FS_FIELD_EDITOR_CONFIG } from '../injectors/fs-field-editor.providers';
import { initField } from '../helpers/init-field';
import { FieldEditorConfig, FsFieldEditorCallbackParams } from '../interfaces/field-editor-config.interface';
import { EditorAction } from '../enums';
import { ToolbarItem } from '../interfaces';


@Injectable()
export class FieldEditorService implements OnDestroy {

  public config: FieldEditorConfig;
  public editorId = `fs-fields-${fsGuid()}`;

  public inDeletionMode = false;

  private _fieldSelected$ = new BehaviorSubject<Field>(null);
  private _fieldUpdated$ = new Subject<Field>();
  private _scrollTargetField: Field = null;
  private _destroy$ = new Subject<void>();
  private _fieldAdded$ = new Subject<Field>();
  private _fieldChanged$ = new Subject<Field>();

  constructor(
    @Inject(FS_FIELD_EDITOR_CONFIG) private _defaultConfig: FieldEditorConfig,
  ) { }

  public get fieldAdded$(): Observable<Field> {
    return this._fieldAdded$.asObservable();
  }

  public get fieldSelected(): Field {
    return this._fieldSelected$.getValue();
  }

  public get fieldSelected$(): Observable<Field> {
    return this._fieldSelected$.asObservable();
  }

  public get fieldUpdated$(): Observable<Field> {
    return this._fieldUpdated$.asObservable();
  }

  public get fields(): Field[] {
    return cloneDeep(this.config.fields);
  }

  public set fields(fields: Field[]) {
    this.config.fields = fields
      .map((field) => {
        return this.initField(field);
      });
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

  public updateField(field: Field): void {
    const index = this.findFieldIndexByGuid(field.guid);

    if (index !== -1) {
      this.fields = this.fields
        .map((_field, _index) => {
          return index === _index ?
            {
              ..._field,
              ...field,
            } : _field;
        });

      this._fieldUpdated$.next(this.fields[index]);
    }
  }

  public findField(func: (field: Field) => boolean): Field {
    return this.fields.find(func);
  }

  public findFieldByGuid(guid: string): Field {
    return this.findField((field) => field.guid === guid);
  }

  public findFieldIndex(func: (field: Field) => boolean): number {
    return this.fields.findIndex(func);
  }

  public findFieldIndexByGuid(guid: string): number {
    return this.findFieldIndex((field) => field.guid === guid);
  }

  public fieldShowDelete(field: Field): Observable<boolean> {
    return this.config.fieldShowDelete ?
      this.config.fieldShowDelete(field) :
      of(true);
  }

  public fieldCanEdit(field: Field): Observable<boolean> {
    return this.config.fieldCanEdit ?
      this.config.fieldCanEdit(field) :
      of(true);
  }

  public fieldShowActions(field: Field): Observable<boolean> {
    return this.config.fieldShowActions ?
      this.config.fieldShowActions(field) : of(true);
  }

  public fieldShowDuplicate(field: Field): Observable<boolean> {
    return this.config.fieldShowDuplicate ?
      this.config.fieldShowDuplicate(field) :
      of(true);
  }

  public fieldShowSettings(field: Field): Observable<boolean> {
    return this.config.fieldShowSettings ?
      this.config.fieldShowSettings(field) :
      of(true);
  }

  public fieldShowRequired(field: Field): Observable<boolean> {
    return this.config.fieldShowRequired ?
      this.config.fieldShowRequired(field) :
      of(!field.hideRequired);
  }

  public fieldShowDescription(field: Field): Observable<boolean> {
    return this.config.fieldShowDescription ?
      this.config.fieldShowDescription(field) :
      of(!field.hideDescription);
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

  public fieldCanReorder(field: Field): Observable<boolean> {
    return this.config.fieldCanReorder ?
      this.config.fieldCanReorder(field) :
      of(true);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public selectField(field: Field): void {
    this.config.beforeFieldSelect(field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._fieldSelected$.next(field);
      });
  }

  public unselectField() {
    if (this.fieldSelected) {
      this.config.afterFieldUnselected(this.fieldSelected);
      this._fieldSelected$.next(null);
    }
  }

  public setConfig(config: FieldEditorConfig) {
    this.config = {
      ...this._defaultConfig,
      ...config,
    };

    this.config = {
      ...config,
      canAddField: config.canAddField ?? true,
      afterFieldUnselected: config.afterFieldUnselected ? config.afterFieldUnselected : (field: Field) => {
        return of(field);
      },
      afterFieldDuplicated: config.afterFieldDuplicated ? config.afterFieldDuplicated : (field: Field) => {
        return of(field);
      },
      afterFieldDropped: config.afterFieldDropped ? config.afterFieldDropped : (field: Field) => {
        return of(field);
      },
      afterFieldAdded: config.afterFieldAdded ? config.afterFieldAdded : (field: Field) => {
        return of(field);
      },
      beforeFieldAdd: config.beforeFieldAdd ? config.beforeFieldAdd : (field: Field) => {
        return of(field);
      },
      beforeFieldSelect: config.beforeFieldSelect ? config.beforeFieldSelect : (field: Field) => {
        return of(field);
      },
      beforeFieldDuplicate: config.beforeFieldDuplicate ? config.beforeFieldDuplicate : (field: Field) => {
        return of(field);
      },
    };

    if (this.config.fields) {
      this.fields = this.config.fields;
    }
  }

  public initField(field: Field) {
    field = initField(field);

    return {
      ...(this.config.initField ? this.config.initField(field) : field),
    };
  }

  public insertField(field: Field, index?: number, toolbarItem?: ToolbarItem): Observable<Field> {
    field = this.initField(field);

    if (index === undefined) {
      index = this.fieldSelected ? this.config.fields.indexOf(this.fieldSelected) + 1 : this.numberOfFields;
    }

    return this.config.beforeFieldAdd(field, toolbarItem)
      .pipe(
        switchMap((_field) => this.action(EditorAction.FieldAdd, _field, { index, toolbarItem })),
        switchMap((response) => {
          const newField = this.initField(response.field);
          this.config.fields.splice(index, 0, newField);
          this._scrollTargetField = newField;
          this._fieldAdded$.next(newField);

          return this.config.afterFieldAdded(newField, toolbarItem);
        }),
        takeUntil(this._destroy$),
      );
  }

  public appendField(field: Field, toolbarItem?: ToolbarItem): Observable<Field> {
    return this.insertField(field, undefined, toolbarItem);
  }

  public fieldChange(field: Field): void {
    this.fields = this.config.fields
      .map((_field) => {
        return _field.guid === field.guid ? field : _field;
      });

    if (this.config.fieldChanged) {
      field = this._prepareItem(field);
      this._fieldChanged$.next(field);

      this.config.fieldChanged(field);
    }
  }

  public fieldChanged(): Observable<Field> {
    return this._fieldChanged$.asObservable();
  }

  public action(action: EditorAction, field: Field = null, data: any = {}): Observable<any> {
    return (
      this.config.action ?
        this.config.action(action, field, data) :
        of(field)
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
