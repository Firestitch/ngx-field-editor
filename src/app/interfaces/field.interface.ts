import { FieldType } from '../enums/field-type';


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
