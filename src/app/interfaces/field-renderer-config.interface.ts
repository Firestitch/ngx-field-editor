import { Observable } from 'rxjs';

import { RendererAction } from '../enums';

import { Field } from './field.interface';


export interface FieldRendererConfig {

  fields?: Field[];

  afterFileDeleted?: (field: Field, data: any) => void;

  canFileDelete?: (field: Field) => Observable<boolean>;
  canFileDownload?: (field: Field) => Observable<boolean>;
  canImageUpload?: (field: Field) => Observable<boolean>;

  showField?: (field: Field) => Observable<boolean>;
  disableField?: (field: Field) => Observable<boolean>;

  initField?: (field: Field) => Field;

  action?: (action: RendererAction, field: Field, data: any) => Observable<any>;
}
