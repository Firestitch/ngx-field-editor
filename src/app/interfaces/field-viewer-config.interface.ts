import { FieldOption } from './field-option.interface';
import { Field } from './field.interface';


export interface FieldViewerConfig {
  fields?: (Field | FieldOption)[],
}
