import { Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Toolbar, ToolbarItem } from './toolbar.interface';

import { Field } from './field.interface';

export interface FsFieldEditorCallbackParams {
  field?: Field;
  fields?: Field[];
  event?: PointerEvent | CdkDragDrop<unknown> | Event;
  toolbarField?: ToolbarItem;
}

export type FsFieldEditorCallbackFn = (data: FsFieldEditorCallbackParams) => void | Observable<Field>;

export interface FieldEditorConfig {
  fields?: Field[],
  toolbar?: Toolbar,
  fieldDrop?: Function,
  fieldCanEdit?: (field: Field) => Observable<boolean>,
  fieldCanDelete?: (field: Field) => Observable<boolean>,
  fieldCanDuplicate?: (field: Field) => Observable<boolean>,
  fieldCanRequire?: (field: Field) => Observable<boolean>,
  fieldCanLabel?: (field: Field) => Observable<boolean>,
  fieldCanConfig?: (field: Field) => Observable<boolean>,
  fieldChanged?: (field?: Field) => void,
  fieldAdd?: FsFieldEditorCallbackFn,
  fieldAdded?: FsFieldEditorCallbackFn,
  fieldSelected?: FsFieldEditorCallbackFn,
  fieldUnselected?: FsFieldEditorCallbackFn,
  fieldMoved?: FsFieldEditorCallbackFn,
  fieldDuplicate?: FsFieldEditorCallbackFn,
  fieldDuplicated?: FsFieldEditorCallbackFn,
  fieldRemoved?: FsFieldEditorCallbackFn,
  imageUpload?: (field: Field, file: File) => Observable<string>,
  fileUpload?: (field: Field, file: File) => Observable<{ name: string, url: string }>,
  fileRemove?: (field: Field, data: any) => Observable<boolean>,
  fileRemoved?: (field: Field, data: any) => void,
  fileDownload?: (field: Field, data: any) => void,
}
