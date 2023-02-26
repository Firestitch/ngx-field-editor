import { Observable } from 'rxjs';

import { FieldType } from '../enums/field-type';

import { Field } from './field.interface';

export interface Toolbar {
  items: ToolbarItems;
}

export type ToolbarItems = ToolbarItem[];

export interface ToolbarItem {
  icon?: string;
  label?: string;
  type?: FieldType | string;
  divide?: boolean;
  disabled?: boolean;
  items?: ToolbarItem[];
  data?: any;
  click?: (field: Field, toolbarItem: ToolbarItem) => Observable<any>;
}
