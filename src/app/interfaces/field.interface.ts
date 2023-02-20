import { FieldType } from '../enums';

export interface Field {
  guid?: string,
  type?: FieldType | string,
  label?: string,
  description?: string,
  hideRequired?: boolean;
  hideDescription?: boolean;
  configs?: any,
  data?: any,
}
