import { Observable } from 'rxjs';

import { RendererAction } from '../enums';

import { Field } from './field.interface';


export interface FieldRendererConfig {
  fields?: Field[];

  fieldChanged?: (field?: Field) => void;
  afterFileDeleted?: (field: Field, data: any) => void;

  allowFileDelete?: (field: Field) => Observable<boolean>;
  allowFileDownload?: (field: Field) => Observable<boolean>;
  allowImageUpload?: (field: Field) => Observable<boolean>;

  showField?: (field: Field) => Observable<boolean>;

  action?: (action: RendererAction, field: Field, data: any) => Observable<any>;
}
