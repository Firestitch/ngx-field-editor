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
  fieldCanDelete?: (field: Field) => Observable<boolean>,
  fieldCanDuplicate?: (field: Field) => Observable<boolean>,
  fieldCanRequire?: (field: Field) => Observable<boolean>,
  fieldCanLabel?: (field: Field) => Observable<boolean>,
  fieldCanConfig?: (field: Field) => Observable<boolean>,
  
  fieldChanged?: (field?: Field) => void,

  beforeFieldAdded?: (field: Field, toolbarItem: ToolbarItem) => Observable<Field>,
  beforeFieldDuplicated?: (field: Field) => Observable<Field>,
  beforeFieldSelected?: (field: Field) => Observable<any>,

  afterFieldDuplicated?: (field: Field) => Observable<any>,
  afterFieldRemoved?: (field: Field) => Observable<any>,
  afterFieldAdded?: (field: Field) => Observable<any>,
  afterFieldUnselected?: (field: Field) => Observable<any>,
  afterFieldDropped?: (field: Field, index: number) => Observable<any>,

  imageUpload?: (field: Field, file: File) => Observable<string>,
  fieldAction: (action: FieldAction, field: Field, data: any) => Observable<Field>,
}
