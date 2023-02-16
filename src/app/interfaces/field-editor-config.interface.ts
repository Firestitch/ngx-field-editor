import { Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Toolbar, ToolbarItem } from './toolbar.interface';

import { Field } from './field.interface';
import { FieldAction } from '../enums';
import { FieldOption } from './field-option.interface';

export interface FsFieldEditorCallbackParams {
  field?: Field;
  fields?: Field[];
  event?: PointerEvent | CdkDragDrop<unknown> | Event;
  toolbarField?: ToolbarItem;
}

export type FsFieldEditorCallbackFn = (data: FsFieldEditorCallbackParams) => void | Observable<Field>;

export interface FieldEditorConfig {
  fields?: (Field | FieldOption)[],
  toolbar?: Toolbar,

  fieldCanEdit?: (field: Field) => Observable<boolean>,
  fieldShowDelete?: (field: Field) => Observable<boolean>,
  fieldShowSettings?: (field: Field) => Observable<boolean>,
  fieldShowDuplicate?: (field: Field) => Observable<boolean>,
  fieldShowRequire?: (field: Field) => Observable<boolean>,
  fieldCanLabel?: (field: Field) => Observable<boolean>,
  fieldCanConfig?: (field: Field) => Observable<boolean>,
  
  fieldChanged?: (field?: Field) => void,

  beforeFieldAdd?: (field: Field, toolbarItem: ToolbarItem) => Observable<Field>,
  beforeFieldDuplicate?: (field: Field) => Observable<Field>,
  beforeFieldSelect?: (field: Field) => Observable<any>,

  afterFieldDuplicated?: (field: Field) => Observable<any>,
  afterFieldRemoved?: (field: Field) => Observable<any>,
  afterFieldAdded?: (field: Field) => Observable<any>,
  afterFieldUnselected?: (field: Field) => Observable<any>,
  afterFieldDropped?: (field: Field, index: number) => Observable<any>,

  imageUpload?: (field: Field, file: File) => Observable<string>,
  fieldAction: (action: FieldAction, field: Field, data: any) => Observable<Field>,
}
