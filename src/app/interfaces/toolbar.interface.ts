import { FieldType } from '../enums/field-type';

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
}