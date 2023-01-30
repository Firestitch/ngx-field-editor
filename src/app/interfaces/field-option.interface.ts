import { Field, FieldConfig } from '.';

export interface FieldOption extends Field {
  config?: FieldConfig & {
    options?: any[],
  },
}
