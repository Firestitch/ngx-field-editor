import { Field } from './field.interface';
import { FieldEditorConfig } from './field-editor-config.interface'
import { EditorAction } from '../enums';

export interface IEditDialogData {
  field: Field;
  config: FieldEditorConfig;
}

export interface IEditDialogAction {
  action: EditorAction;
  field: Field;
  data: any;
}
