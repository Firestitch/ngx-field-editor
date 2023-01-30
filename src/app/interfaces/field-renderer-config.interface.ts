import { Observable } from 'rxjs';
import { Field } from './field.interface';


export interface FieldRendererConfig {
  fields?: Field[],
  fieldChanged?: (field?: Field) => void,
  
  afterFileRemoved?: (field: Field, data: any) => void,
  
  imageUpload?: (field: Field, file: File) => Observable<string>,
  fileUpload?: (field: Field, file: File) => Observable<{ name: string, url: string }>,
  fileRemove?: (field: Field, data: any) => Observable<any>,
  
  fileDownload?: (field: Field, data: any) => void,
}
