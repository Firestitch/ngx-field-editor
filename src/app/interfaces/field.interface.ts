import { FieldType } from '../enums/field-type';
import { Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


export interface Field {
  config?: {
    guid?: string,
    type?: FieldType | string,
    label?: string,
    description?: string,
    hideRequired?: boolean;
    hideDescription?: boolean;
    configs?: any,
  },
  data?: any,
}

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


export interface FieldRendererConfig {
  fields?: Field[],
  fieldChanged?: (field?: Field) => void,
  imageUpload?: (field: Field, file: File) => Observable<string>,
  fileUpload?: (field: Field, file: File) => Observable<{ name: string, url: string }>,
  fileRemove?: (field: Field, data: any) => Observable<boolean>,
  fileRemoved?: (field: Field, data: any) => void,
  fileDownload?: (field: Field, data: any) => void,
}

export interface Toolbar {
  items: ToolbarItems;
}

export type ToolbarItems = ToolbarItem[] | ToolbarSection[];

export interface ToolbarItem {
  icon?: string;
  label?: string;
  type: FieldType | string;
  divide?: boolean;
  disabled?: boolean;
  config?: Record<string, unknown>;
}

export interface ToolbarSection {
  section: string;
  items: ToolbarItem[];
}
