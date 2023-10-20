import { Observable } from 'rxjs';

import { ViewerAction } from '../enums';

import { FieldOption } from './field-option.interface';
import { Field } from './field.interface';


export interface FieldViewerConfig {
  fields?: (Field | FieldOption)[];
  showField?: (field: Field) => Observable<boolean>;
  action?: (action: ViewerAction, field: Field, data: any) => Observable<any>;
  canFileDownload?: (field: Field) => Observable<boolean>;
}
