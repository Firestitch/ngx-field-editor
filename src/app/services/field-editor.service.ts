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
import { TOOLBAR_DEFAULTS } from '../helpers/toolbar-defaults';
import { FieldEditorConfig, FsFieldEditorCallbackParams } from '../interfaces/field-editor-config.interface';
import { EditorAction } from '../enums';
import { ToolbarItem, ToolbarItems } from '../interfaces';


@Injectable()
export class FieldEditorService implements OnDestroy {

  public config: FieldEditorConfig;
  public editorId = `fs-fields-${guid()}`;

  public inDeletionMode = false;

  private _selectedField$ = new BehaviorSubject<Field>(null);
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
        this._selectedField$.next(field);
      });
  }

  public unselectField() {
    if (this.selectedField) {
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
      this.config.fields = this.config.fields.map((field) => {
        return initField(field);
      });
    }
  }

  public insertNewField(field: Field, index?: number, toolbarItem?: ToolbarItem): Observable<Field> {
    field = initField(field);

    if (index === undefined) {
      index = this.selectedField ? this.config.fields.indexOf(this.selectedField) + 1 : this.numberOfFields;
    }

    return this.config.beforeFieldAdd(field, toolbarItem)
      .pipe(
        switchMap((_field) => this.action(EditorAction.FieldAdd, _field, { index, toolbarItem })),
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
