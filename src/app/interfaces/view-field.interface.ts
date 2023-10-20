import { Observable } from 'rxjs';

import { Field } from './field.interface';

export interface ViewField extends Field {
  hasValue?: boolean;
  show?: Observable<boolean>;
}
