import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Observable } from 'rxjs';

import { EditorAction } from '../enums';

import { Toolbar, ToolbarItem } from './toolbar.interface';
import { Field } from './field.interface';
import { FieldOption } from './field-option.interface';

export interface FsFieldEditorCallbackParams {
  field?: Field;
  fields?: Field[];
  event?: PointerEvent | CdkDragDrop<unknown> | Event;
  toolbarField?: ToolbarItem;
}

export type FsFieldEditorCallbackFn = (data: FsFieldEditorCallbackParams) => void | Observable<Field>;

export interface FieldEditorConfig {
  fields?: (Field | FieldOption)[];
  toolbar?: Toolbar;
  fieldMenu?: FieldMenu;
  selected?: Field;
  canAddField?: boolean;

  fieldCanEdit?: (field: Field) => Observable<boolean>;
  fieldShowDelete?: (field: Field) => Observable<boolean>;
  fieldShowSettings?: (field: Field) => Observable<boolean>;
  fieldShowDuplicate?: (field: Field) => Observable<boolean>;
  fieldShowActions?: (field: Field) => Observable<boolean>;
  fieldShowRequired?: (field: Field) => Observable<boolean>;
  fieldShowDescription?: (field: Field) => Observable<boolean>;
  fieldCanLabel?: (field: Field) => Observable<boolean>;
  fieldCanConfig?: (field: Field) => Observable<boolean>;
  fieldCanReorder?: (field: Field) => Observable<boolean>;

  fieldChanged?: (field?: Field) => void;

  beforeFieldAdd?: (field: Field, toolbarItem: ToolbarItem) => Observable<Field>;
  beforeFieldDuplicate?: (field: Field) => Observable<Field>;
  beforeFieldSelect?: (field: Field) => Observable<any>;

  afterFieldDuplicated?: (field: Field) => Observable<any>;
  afterFieldRemoved?: (field: Field) => Observable<any>;
  afterFieldAdded?: (field: Field, toolbarItem: ToolbarItem) => Observable<any>;
  afterFieldUnselected?: (field: Field) => Observable<any>;
  afterFieldDropped?: (field: Field, index: number) => Observable<any>;

  action: (action: EditorAction, field: Field, data: any) => Observable<Field>;

  initField?: (field: Field) => Field;
}

export interface FieldMenu {
  items?: FieldMenuItem[];
}

export interface FieldMenuItem {
  label?: string;
  click?: (field: Field) => void;
  show?: (field: Field) => Observable<boolean>;
}
