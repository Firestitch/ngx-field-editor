import { Observable } from 'rxjs';

import { FieldOption } from './field-option.interface';
import { Field } from './field.interface';


export interface FieldViewerConfig {
  fields?: (Field | FieldOption)[];
  showField?: (field: Field) => Observable<boolean>;
}
