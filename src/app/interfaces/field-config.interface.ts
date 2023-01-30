import { FieldType } from '../enums';

export interface FieldConfig {
  guid?: string,
  type?: FieldType | string,
  label?: string,
  description?: string,
  hideRequired?: boolean;
  hideDescription?: boolean;
  configs?: any,
}
